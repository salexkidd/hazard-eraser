"""
Django settings for hazarderaser project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'e0*%-xbhbg0spu7jbtf#f2hkg!plnl2)!v($q$5kes!evo&o42'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []

TEMPLATE_DIRS = (
    (os.path.join(BASE_DIR, 'templates')),
)

STATICFILES_DIRS = (
    (os.path.join(BASE_DIR, 'static')),
)

#COFFESCRIPT
COFFEE_PATH_TUPLE = (
    "/usr/local/bin/coffee",
    "/usr/bin/coffee",
    "/Users/toshimitsu.kamei/node_modules/.bin/coffee",
)

COFFEESCRIPT_EXECUTABLE = ""
for coffee_path in COFFEE_PATH_TUPLE:
    if os.path.isfile(coffee_path):
        COFFEESCRIPT_EXECUTABLE = coffee_path
        break

if not COFFEESCRIPT_EXECUTABLE:
    raise IOError("Can't find coffee binary")


# Application definition
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'bootstrapform',
    'coffeescript',    
    'rest_framework',
    'social_auth',
    'hazard',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

AUTHENTICATION_BACKENDS = (
    'social_auth.backends.twitter.TwitterBackend',
    'social_auth.backends.facebook.FacebookBackend',
    'django.contrib.auth.backends.ModelBackend',
)

TWITTER_CONSUMER_KEY = 'P19TXCVUX5HSxuLeuixZQ'
TWITTER_CONSUMER_SECRET = 'UUY4g4kKoELwOZcjTV3HWnXuNFA4FfWrm1hqW9Hmk'

FACEBOOK_APP_ID = ''
FACEBOOK_API_SECRET = ''

ROOT_URLCONF = 'hazarderaser.urls'
WSGI_APPLICATION = 'hazarderaser.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'hazard.sqlite3'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = ''
LOGIN_URL = '/login-form/'
