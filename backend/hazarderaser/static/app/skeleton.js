 (function(){
 	"use strict";
 	var Class, Eventable, Model, View;
 	/**
	* クラスの説明文。
	* @class Class
	**/
 	Class = (function(){
 		/**
		* クラスの説明文。
		* @constructor
		**/
 		var Class = function(){};
 		/**
		* メソッドの説明文。
		* @static
		* @method extends
		* @param [props={}] {Object} properties and methods.
		* @param [statics={}] {Object} static properties and static methods.
		* @return {T extends Model}
		**/
 		Class.extends = function(props, statics){
 			var that = this, klass, constructor;
 			props = props || {};
 			statics = statics || {};
 			if(props.constructor === Object){
 				props.constructor = function(){};
 			}
 			if(typeof statics.extends !== "function"){
 				statics.extends = function(props, statics){
 					var base = this.__base__, klass;
 					this.__base__ = this.__base__.__base__;
 					klass = base.extends.apply(this, arguments);
 					this.__base__ = base;
 					return klass;
 				}
 			}

 			klass = constructor = function(){
 				this.__base__.apply(this, arguments);
 				props.constructor.apply(this, arguments);
 			};
 			Object.keys(that).forEach(function(key){
 				klass[key] = that[key];
 			})
 			Object.keys(statics).forEach(function(key){
 				klass[key] = statics[key];
 			});
 			Object.keys(that.prototype).forEach(function(key){
 				klass.prototype[key] = that.prototype[key];
 			});
 			Object.keys(props).forEach(function(key){
 				klass.prototype[key] = props[key];
 			});
 			klass.prototype.__base__ = function(){
 				var base = this.__base__;
 				this.__base__ = that.prototype.__base__ || null;
 				that.apply(this, arguments);
 				this.__base__ = base;
 			};
 			klass.prototype.klass = klass;
 			klass.prototype.constructor = constructor;
 			klass.__base__ = that;

 			return klass;
 		};
 		
 		return Class;
 	}());

 	Eventable = (function(){
 		var Eventable = Class.extends({
 			constructor: function(){
 				this.__skeletonEventListeners__ = {};
 			}
 			, addEventListener: function(key, listener){
 				if(!Array.isArray(this.__skeletonEventListeners__[key])){
 					this.__skeletonEventListeners__[key] = [];
 				}
 				add(this.__skeletonEventListeners__[key], key, listener);
 			}
 			, removeEventListener: function(key, listener){
 				if(!Array.isArray(this.__skeletonEventListeners__[key])){
 					return;
 				}
 				remove(this.__skeletonEventListeners__[key], key, listener);
 			}
 			, dispatch: function(key){
 				var that, params;
 				if(!Array.isArray(this.__skeletonEventListeners__[key])){
 					return;
 				}
 				that = this;
 				params = [].slice.call(arguments, 1);
 				this.__skeletonEventListeners__[key].forEach(function(listener){
 					listener.apply(that, params);
 				});
 			}
 		});
 		return Eventable;
 	}());

 	/**
	* クラスの説明文。
	* @class Model
	**/
 	Model = (function(){
 		
 		/**
		* クラスの説明文。
		* @constructor
		**/
 		var Model = Eventable.extends({
 			constructor: function(props){
 				var that = this, properties = props || {};
 				this.__properties__ = {};
 				this.klass.properties.forEach(function(key){
 					that.__properties__[key] = {
 						value: null,
 						listeners: []
 					};
 				});
 				Object.keys(properties).forEach(function(key){
 					that[key] = properties[key];
 				});
 				if(this.klass.autoSync){
 					this.addEventListener("change", function(key, val){
 						that.sync(that.export());
 					});
 				}
 			}
 			, bind: function(key, listener){
 				add(this.__properties__[key].listeners, key, listener);
 			}
 			, unbind: function(key, listener){
 				remove(this.__properties__[key].listeners, key, listener);
 			}
 			, sync: function(){}
 			, delete: function(){}
 			, export: function(){
 				var that = this, res = {};
 				this.klass.properties.forEach(function(key){
 					res[key] = that[key];
 				});
 				return res;
 			}
 		},{
 			/**
			* プロパティの説明文。
			* @static
			* @property properties
			* @type Array[string]
			* @default []
			**/
 			properties: []
 			, autoSync: false
 			/**
			* メソッドの説明文。
			* @static
			* @method extends
			* @param [props={}] {Object} properties and methods.
			* @param [statics={}] {Object} static properties and static methods.
			* @return {T extends Model}
			**/
 			, extends: function(props, statics){
 				var klass, properties;
 				klass = Eventable.extends.apply(this, arguments);
 				properties = klass.properties;
 				klass.properties.forEach(function(key){
 					klass.prototype.__defineGetter__(key, function(){return this.__properties__[key].value;});
 					klass.prototype.__defineSetter__(key, function(val){
 						var that = this;
 						this.__properties__[key].value = val;
 						this.__properties__[key].listeners.forEach(function(listener){
 							listener.apply(that, [val]);
 						});
 						this.dispatch("change", key, val);
 					});
 				});
 				return klass;
 			}
 		});
 		return Model;
 	}());

 	var View = (function(){
 		function decodeBinds(elem, strBinds){
 			var binds = [];
 			strBinds.replace(/\s*/g, "").split(";").forEach(function(b){
				var keyval = b.split(":");
				if(keyval.length !== 2){
					throw "miss match";
				}
				binds.push({
					element: elem,
					keys: keyval[0].split("."),
					values: keyval[1].split(".")
				});
			});
			return binds;
 		}
 		function decode(jsonml){
 			var _decode = function(jsonml){
 				var tag = jsonml[0],
	 				ext = jsonml.slice(1, jsonml.length);
	 			var elem;
	 			if(typeof tag === "string"){
	 				elem = document.createElement(tag);
	 				for(var i = 0, len = ext.length; i < len; i++){
		 				if(Array.isArray(ext[i])){
		 					elem.appendChild(_decode(ext[i]));
		 				} else if(ext[i].constructor == Object){
		 					Object.keys(ext[i]).forEach(function(attr){
		 						elem.setAttribute(attr, ext[i][attr]);
		 						if(attr === "data-bind"){
			 						binds = binds.concat(decodeBinds(elem, ext[i][attr]));
			 					}
			 					if(attr === "data-bind-attr"){
			 						bindAttrs = bindAttrs.concat(decodeBinds(elem, ext[i][attr]));
			 					}
		 					});
		 				} else if(typeof ext[i] === "string"){
		 					elem.innerText = ext[i];
		 				}
	 				}
	 			}
	 			return elem;
 			}, binds = [], bindAttrs = [];
 			return {
 				element: _decode(jsonml),
 				binds: binds,
 				bindAttrs: bindAttrs
 			};
 		}
 		function explorer(obj, keys){
 		    var head = keys[0]
                , tails = keys.slice(1, keys.length);
			if(typeof obj[head] === "undefind"){
				throw "miss match binding";
			}
			if(tails.length == 0){
				return {
					object: obj,
					key: head
				};
			}
			return explorer(obj[head], tails);
		}
 		var View = Eventable.extends({
 			constructor: function(props){
 				var that = this, properties = props || {};
	 			Object.keys(properties).forEach(function(key){
					that[key] = properties[key];
				});
	 			this.__skeletonEvents__.forEach(function(event){
	 				that.addEventListener(event.trigger, that[event.callback]);
	 			});
	 			if(!!this.model){
		 			this.__modelEvents__.forEach(function(event){
		 				that.model.addEventListener(event.trigger, that[event.callback]);
		 			});
	 			}
 			}
 			, render: function(silent){
 				var that = this, element, decoded;
 				
	 			if(!Array.isArray(this.template)){
	 				return;
	 			}

	 			element = document.createElement("div");
 				decoded = decode(this.template);
 				element.appendChild(decoded.element);
 				this.element = element;
 				this.__binds__ = decoded.binds;
 				this.__bindAttrs__ = decoded.bindAttrs;
	 			
	 			//if(!!this.model){
	 			    this.__binds__.forEach(function (b) {
	 			        var raw = b.values[0].match(/"(.*)"/) || b.values[0].match(/'(.*)'/);
	 			        if (!!raw) {
	 			            var target = explorer(b.element, b.keys);
	 			            target.object[target.key] = raw[1];
	 			        } else {
	 			            that.model.bind(b.values[0], function (val) {
	 			                var target, value;
	 			                target = explorer(b.element, b.keys);
	 			                value = explorer(that.model, b.values);
	 			                target.object[target.key] = value.object[value.key];
	 			            });
	 			            var value = explorer(that.model, b.values);
	 			            value.object[value.key] = value.object[value.key];
	 			        }
		 			});
		 			this.__bindAttrs__.forEach(function(b){
		 				that.model.bind(b.values[0], function(val){
		 					var value;
							value = explorer(that.model, b.values);
							b.element.setAttribute(b.keys[0], value.object[value.key])
		 				});
		 				var value = explorer(that.model, b.values);
		 				value.object[value.key] = value.object[value.key];
		 			});
	 			//}
	 			this.__domEvents__.forEach(function(event){
	 				var targets = that.findAll(event.target);
	 				if(targets.length == 0){
	 					throw "Target element is not found: " + event.target;
	 				}
	 				targets.forEach(function(target){
	 					target.addEventListener(event.trigger, function(){
		 					that[event.callback].apply(that, arguments);
		 				});
	 				});
	 			});
	 			this.element = element.firstElementChild;
	 			this.element.skeleton = this;
	 			if(!silent){
	 				this.dispatch("rendered");
	 			}
	 			return this.element;
 			}
 			, renderTo: function(parent){
 				this.render(true);
 				if(typeof parent === "string"){
 					document.querySelector(parent).appendChild(this.element);
	 			} else if(!!parent.appendChild){
	 				parent.appendChild(this.element);
	 			} else {
	 				return;
	 			}
	 			this.dispatch("rendered");
	 			return this;
 			}
 			, find: function(query){
	 			if(this.element === null){
	 				throw "not element";
	 			}
	 			var elem = this.element.querySelector(query);
	 			if(!!elem)
	 				return elem
	 			elem = this.element.parentElement.querySelector(query);
	 			if(!!elem && elem === this.element)
	 				return elem;
	 			return null;
	 		}
	 		, findAll: function(query){
	 			var founds = [], elems, elem, i, len;
	 			if(this.element === null){
	 				throw "not element";
	 			}
	 			elems = this.element.querySelectorAll(query);
	 			if(elems.length > 0){
	 				for(i = 0, len = elems.length; i < len; i++){
	 					founds.push(elems[i]);
	 				}
	 				return founds;
	 			}
	 			elem = this.element.parentElement.querySelector(query);
	 			if(!!elem && elem === this.element){
	 				founds.push(elem);
	 				return founds;
	 			}
	 			return founds;
	 		}
 		},{
 			extends: function(props, statics){
 				var klass;
 				klass = Eventable.extends.apply(this, arguments);
 				klass.prototype.__modelEvents__ = [];
 				klass.prototype.__domEvents__ = [];
 				klass.prototype.__skeletonEvents__ = [];
 				if(!!props.events && props.events.constructor === Object){
 					Object.keys(props.events).forEach(function(key){
						var trigger, array;
						array = key.split(/\s+/);
						trigger = array.shift();
						if(array.length > 0){
							if(array[0] === "model"){
								klass.prototype.__domEvents__.push({
									trigger: trigger,
									callback: props.events[key]
								});
							} else {
								klass.prototype.__domEvents__.push({
									trigger: trigger,
									target: array.join(" "),
									callback: props.events[key]
								});
							}
						} else {
							klass.prototype.__skeletonEvents__.push({
								trigger: trigger,
								callback: props.events[key]
							});
						}
					});
 				}
 				return klass;
 			}
 		});
 		return View;
 	}());
 	
 	function add(listeners, key, listener){
		var i = listeners.length;
		while(i--){
			if(listeners[i] === listener){
				return;
			}
		}
		listeners.push(listener);
	}
	function remove(listeners, key, listener){
		var i = listeners.length;
		while(i--){
			if(listeners[i] === listener){
				listeners.splice(i, 1);
				return;
			}
		}
	}
 	window.Skeleton = {
 		Class: Class
 		, Eventable: Eventable
 		, Model: Model
 		, View: View
 	};
 }());
