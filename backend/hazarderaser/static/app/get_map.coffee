window.map = null
window.location_watcher = null

zoom_level = 13

getMap = (geopos) ->
  if not window.map?
    settings = 
      credentials: "AmykbqsWcQmLAUbcnEpFLeiAMn64hcnirYQ0JEb5xQwz4lhC1-qpYwU0YULXDVC_"
      center: new Microsoft.Maps.Location(geopos.coords.latitude, geopos.coords.longitude)
      mapTypeId: Microsoft.Maps.MapTypeId.road
      zoom: zoom_level

    window.map = new Microsoft.Maps.Map(
      document.getElementById("map"), settings
    )

  center =
    latitude: geopos.coords.latitude
    longitude: geopos.coords.longitude

  console.log "---- now location is -----"
  console.log cener

  window.map.setView
    center: center
    zoom: zoom_level

  pin = new Microsoft.Maps.Pushpin(
    center, { text: 'N' });

  window.map.entities.push(pin);


setup = ->
  watcher_option = 
    enableHighAccuracy: true
    timeout: 60000
    maximumAge: 0

  success_func = (geopos) ->
    console.log "Check geo position"
    getMap(geopos)

  error_func = (e) ->
    console.log e.message
    alert("Can't get location. Please turn on to Geolocation Service")

  window.watcher = window.navigator.geolocation.watchPosition(
    success_func, error_func, watcher_option
  )

  console.log "setup complete"

$("body").ready ->
    setup()
