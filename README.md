cordova-android-play-services-gradle-release [![Latest Stable Version](https://img.shields.io/npm/v/cordova-android-play-services-gradle-release.svg)](https://www.npmjs.com/package/cordova-android-play-services-gradle-release) [![Total Downloads](https://img.shields.io/npm/dt/cordova-android-play-services-gradle-release.svg)](https://npm-stat.com/charts.html?package=cordova-android-play-services-gradle-release)
============================================

Cordova/Phonegap plugin for Android to align versions of the Play Services library components specified by other plugins to a specific version.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Purpose](#purpose)
- [Caveats](#caveats)
- [Requirements](#requirements)
- [Installation](#installation)
- [Component versions](#component-versions)
  - [Default version](#default-version)
  - [Other versions](#other-versions)
- [Credits](#credits)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
 
# Purpose

**TL;DR**: To prevent build failures caused by including different versions of Play Services library components. 

Some Cordova plugins include the [Play Services library](https://developers.google.com/android/guides/overview) to faciliate them.
Most commonly, these are now included into the Cordova project by specifying them as Gradle dependencies (see the [Cordova plugin spec documenation](https://cordova.apache.org/docs/en/latest/plugin_ref/spec.html#framework)).

Example plugins:
- [cordova-plugin-googleplus)](https://github.com/EddyVerbruggen/cordova-plugin-googleplus)
- [phonegap-plugin-push@1](https://github.com/phonegap/phonegap-plugin-push/tree/v1.10.5)
- [google-analytics-plugin](https://github.com/danwilson/google-analytics-plugin)

The problem arises when these plugins specify different versions of the Play Services library components. This can cause build failures to occur, which are not easy to resolve without changes by the plugin authors to align the specified versions. See these issues:

- [phonegap-plugin-push#17720](https://github.com/phonegap/phonegap-plugin-push/issues/17720)
- [google-analytics-plugin#427](https://github.com/danwilson/google-analytics-plugin/issues/427)
- [cordova-plugin-googleplus#398](https://github.com/EddyVerbruggen/cordova-plugin-googleplus/issues/398)

To resolve these version collisions, this plugin injects a Gradle configuration file into the native Android platform project, which overrides any versions specified by other plugins, and forces them to the version specified in its Gradle file.

If you're encountering similar problems with the Android Support and/or Firebase libraries, checkout the sister plugins:
- [cordova-android-support-gradle-release](https://github.com/dpa99c/cordova-android-support-gradle-release)
- [cordova-android-play-services-gradle-release](https://github.com/dpa99c/cordova-android-play-services-gradle-release)

# Caveats

**Other plugins that reference the Firebase library**

* If your project includes a plugin which uses the Firebase library (such as [phonegap-plugin-push](https://github.com/phonegap/phonegap-plugin-push), [cordova-plugin-fcm](https://github.com/fechanique/cordova-plugin-fcm), [cordova-plugin-firebase](https://github.com/arnesson/cordova-plugin-firebase)) you may find your build still fails.
* This is because the versions of the Play Services and Firebase libraries are related - see [Android Library Versions](https://developers.google.com/android/guides/versioning) for details.
* You can use [cordova-android-firebase-gradle-release](https://github.com/dpa99c/cordova-android-firebase-gradle-release) to override the Firebase SDK component versions to align with the Play Services library component versions specified via this plugin in order to resolve build issues.

**Other plugins that reference the Google Services plugin**

* There are certain Cordova plugins which reference the [Google Services plugin](https://developers.google.com/android/guides/google-services-plugin) in their Gradle config, for example:
    * [cordova-plugin-fcm](https://github.com/fechanique/cordova-plugin-fcm) in [FCMPlugin.gradle](https://github.com/fechanique/cordova-plugin-fcm/blob/master/src/android/FCMPlugin.gradle#L13)
    * [phonegap-plugin-push@2.2.2](https://github.com/phonegap/phonegap-plugin-push/tree/v2.2.2) in [push.gradle](https://github.com/phonegap/phonegap-plugin-push/blob/v2.2.2/push.gradle#L35)
* The Google Services plugin itself references a particular version of the Play Services library
    * The version of Play Services library referenced depends on the version of the Google Services plugin referenced by the Cordova plugin.
* If a plugin (such as `cordova-plugin-fcm`) is included into a Cordova project along with this plugin, then this plugin is unable to override the Play Services library version specified by the Google Services plugin.
* Attempting to do this will result in a build failure with an error message such as `Found com.google.android.gms:play-services-location:12.+, but version 9.0.0 is needed for the google-services plugin.`
* The only solution you can implement using this plugin is to specify the same version as required by the Google Services plugin
    * In the example error above, that would mean installing this plugin with: `cordova plugin add cordova-android-play-services-gradle-release  --variable play-services-location=9.0.0`

# Requirements

This plugin requires `cordova@8+` (CLI) and `cordova-android@7+` (Android platform).
Since the plugin uses hook scripts it will not work in Cloud Build environments such as Phonegap Build.

# Installation

    # override using default component versions
    $ cordova plugin add cordova-android-play-services-gradle-release
    
    # override using custom component versions 
    $ cordova plugin add cordova-android-play-services-gradle-release  --variable play-services-location=17.0.0
    
# Component versions
This plugin enables overriding the version of the following Play Services library components:

    com.google.android.gms:play-services-ads
    com.google.android.gms:play-services-ads-identifier
    com.google.android.gms:play-services-ads-lite
    com.google.android.gms:play-services-afs-native
    com.google.android.gms:play-services-analytics
    com.google.android.gms:play-services-analytics-impl
    com.google.android.gms:play-services-appinvite
    com.google.android.gms:play-services-audience
    com.google.android.gms:play-services-auth
    com.google.android.gms:play-services-auth-api-phone
    com.google.android.gms:play-services-awareness
    com.google.android.gms:play-services-base
    com.google.android.gms:play-services-basement
    com.google.android.gms:play-services-cast
    com.google.android.gms:play-services-cast-framework
    com.google.android.gms:play-services-clearcut
    com.google.android.gms:play-services-cronet
    com.google.android.gms:play-services-drive
    com.google.android.gms:play-services-fido
    com.google.android.gms:play-services-fitness
    com.google.android.gms:play-services-flags
    com.google.android.gms:play-services-games
    com.google.android.gms:play-services-gass
    com.google.android.gms:play-services-gcm
    com.google.android.gms:play-services-identity
    com.google.android.gms:play-services-iid
    com.google.android.gms:play-services-instantapps
    com.google.android.gms:play-services-location
    com.google.android.gms:play-services-maps
    com.google.android.gms:play-services-measurement
    com.google.android.gms:play-services-measurement-api
    com.google.android.gms:play-services-measurement-impl
    com.google.android.gms:play-services-measurement-sdk
    com.google.android.gms:play-services-measurement-sdk-api
    com.google.android.gms:play-services-nearby
    com.google.android.gms:play-services-oss-licenses
    com.google.android.gms:play-services-panorama
    com.google.android.gms:play-services-phenotype
    com.google.android.gms:play-services-places
    com.google.android.gms:play-services-places-placereport
    com.google.android.gms:play-services-plus
    com.google.android.gms:play-services-safetynet
    com.google.android.gms:play-services-stats
    com.google.android.gms:play-services-tagmanager
    com.google.android.gms:play-services-tagmanager-api
    com.google.android.gms:play-services-tagmanager-v4-impl
    com.google.android.gms:play-services-tasks
    com.google.android.gms:play-services-vision
    com.google.android.gms:play-services-vision-common
    com.google.android.gms:play-services-vision-image-label
    com.google.android.gms:play-services-wallet
    com.google.android.gms:play-services-wearable

## Default version
By default, this plugin pins a recent version of each of the Play Services library components.
You can see what the currently pinned versions are by looking at the `<preference>`'s in the [`plugin.xml`](https://github.com/dpa99c/cordova-android-play-services-gradle-release/blob/master/plugin.xml).

## Other versions
You may want to specify a version of the Play Services library components - [see here](https://developers.google.com/android/guides/releases) for a list recent versions.

Library component versions are specified in the Android build as Gradle artifacts in the format `packageId:componentId:versionNumber`, for example `com.google.android.gms:play-services-location:17.0.0`.
To override the default version when installing this plugin, specify a plugin variable where the variable key is the component ID and the value is the version number. 
For example, if you want to install v17.0.0 of the Play Services library Location component, you'd specify the version via the variable:

    cordova plugin add cordova-android-play-services-gradle-release --variable play-services-location=17.0.0
    
You can also specify the the overrides directly in the `config.xml` and this plugin will find them, for example:

    <plugin name="cordova-android-play-services-gradle-release" spec="^4.0.0">
        <variable name="play-services-location" value="17.0.0" />
    </plugin>

Or in the `package.json`, e.g.:

    {
        "cordova": {
            "plugins": {
                "cordova-android-play-services-gradle-release": {
                    "play-services-location": "17.0.0"
                }
            }
        }
    }           

Note: the plugin is case-insensitive to the component ID so `PLAY-SERVICES-LOCATION` or `play-services-location` will both work.

# Credits

Thanks to [**Chris Scott, Transistor Software**](https://github.com/christocracy) for his idea of extending the initial implementation to support dynamic specification of the library version via a plugin variable in [cordova-google-api-version](https://github.com/transistorsoft/cordova-google-api-version)


License
================

The MIT License

Copyright (c) 2017 Dave Alden / Working Edge Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
