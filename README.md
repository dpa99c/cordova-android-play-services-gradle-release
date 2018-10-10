cordova-android-play-services-gradle-release [![Latest Stable Version](https://img.shields.io/npm/v/cordova-android-play-services-gradle-release.svg)](https://www.npmjs.com/package/cordova-android-play-services-gradle-release) [![Total Downloads](https://img.shields.io/npm/dt/cordova-android-play-services-gradle-release.svg)](https://npm-stat.com/charts.html?package=cordova-android-play-services-gradle-release)
============================================

This Cordova/Phonegap plugin for Android aligns various versions of the Play Services library specified by other plugins to a specific version.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Purpose](#purpose)
- [Caveats](#caveats)
- [Installation](#installation)
- [Library versions](#library-versions)
  - [Default version](#default-version)
  - [Other versions](#other-versions)
- [Example](#example)
- [Credits](#credits)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
 
# Purpose

**TL;DR**: To prevent build failures caused by including different versions of the Play Services library. 

Some Cordova plugins include the [Play Services library](https://developers.google.com/android/guides/overview) to faciliate them.
Most commonly, these are now included into the Cordova project by specifying them as Gradle dependencies (see the [Cordova plugin spec documenation](https://cordova.apache.org/docs/en/latest/plugin_ref/spec.html#framework)).

Example plugins:
- [cordova-plugin-googleplus)](https://github.com/EddyVerbruggen/cordova-plugin-googleplus)
- [phonegap-plugin-push@1](https://github.com/phonegap/phonegap-plugin-push/tree/v1.10.5)
- [google-analytics-plugin](https://github.com/danwilson/google-analytics-plugin)

The problem arises when these plugins specify different versions of the Play Services library. This can cause build failures to occur, which are not easy to resolve without changes by the plugin authors to align the specified versions. See these issues:

- [phonegap-plugin-push#17720](https://github.com/phonegap/phonegap-plugin-push/issues/17720)
- [google-analytics-plugin#427](https://github.com/danwilson/google-analytics-plugin/issues/427)
- [cordova-plugin-googleplus#398](https://github.com/EddyVerbruggen/cordova-plugin-googleplus/issues/398)

To resolve these version collisions, this plugin injects a Gradle configuration file into the native Android platform project, which overrides any versions specified by other plugins, and forces them to the version specified in its Gradle file.

If you're encountering similar problems with the Android Support and/or Firebase libraries, checkout the sister plugins:
- [cordova-android-support-gradle-release](https://github.com/dpa99c/cordova-android-support-gradle-release)
- [cordova-android-firebase-gradle-release](https://github.com/dpa99c/cordova-android-firebase-gradle-release)

# Caveats

**Other plugins that reference the Firebase library**

* If your project includes a plugin which uses the Firebase library (such as [phonegap-plugin-push](https://github.com/phonegap/phonegap-plugin-push), [cordova-plugin-fcm](https://github.com/fechanique/cordova-plugin-fcm), [cordova-plugin-firebase](https://github.com/arnesson/cordova-plugin-firebase)) you may find your build still fails.
* This is because the versions of the Play Services and Firebase libraries are related - see [Android Library Versions](https://developers.google.com/android/guides/versioning) for details.
* You can use [cordova-android-firebase-gradle-release](https://github.com/dpa99c/cordova-android-firebase-gradle-release) to override the Firebase library version to align with the Play Services library version specified via this plugin in order to resolve build issues.
* See [#50](https://github.com/dpa99c/cordova-plugin-request-location-accuracy/issues/50) for an example.

**Other plugins that reference the Google Services plugin**

* There are certain Cordova plugins which reference the [Google Services plugin](https://developers.google.com/android/guides/google-services-plugin) in their Gradle config, for example:
    * [cordova-plugin-fcm](https://github.com/fechanique/cordova-plugin-fcm) in [FCMPlugin.gradle](https://github.com/fechanique/cordova-plugin-fcm/blob/master/src/android/FCMPlugin.gradle#L13)
    * [phonegap-plugin-push@2.2.2](https://github.com/phonegap/phonegap-plugin-push/tree/v2.2.2) in [push.gradle](https://github.com/phonegap/phonegap-plugin-push/blob/v2.2.2/push.gradle#L35)
* The Google Services plugin itself references a particular version of the Play Services library
    * The version of Play Services library referenced depends on the version of the Google Services plugin referenced by the Cordova plugin.
* If a plugin (such as `cordova-plugin-fcm`) is included into a Cordova project along with this plugin, then this plugin is unable to override the Play Services library version specified by the Google Services plugin.
* Attempting to do result with result in a build failure with an error message such as `Found com.google.android.gms:play-services-location:12.+, but version 9.0.0 is needed for the google-services plugin.`
* The only here solution you can implement using this plugin is to specifiy the same version as required by the Google Services plugin
    * In the example error above, that would mean installing this plugin with: `cordova plugin add cordova-android-play-services-gradle-release  --variable PLAY_SERVICES_VERSION=9.0.0`





# Installation

    $ cordova plugin add cordova-android-play-services-gradle-release
    $ cordova plugin add cordova-android-play-services-gradle-release  --variable PLAY_SERVICES_VERSION={required version}
    
The plugin needs to be installed with the [`cordova-fetch`](https://cordova.apache.org/news/2016/05/24/tools-release.html) mechanism in order to satisfy its [package dependencies](https://github.com/dpa99c/cordova-android-play-services-gradle-release/blob/master/package.json#L8) by installing it via npm.

Therefore if you're installing with `cordova@6`, you'll need to explicitly specify the `--fetch` option:

    $ cordova plugin add cordova-android-play-services-gradle-release --fetch   
    
# Library versions

## Default version
By default, this plugin will use the most recent major version the Play Services library:
The current default set by this plugin is: `15.+`

    $ cordova plugin add cordova-android-play-services-gradle-release

## Other versions

In some cases, you may want to specify a different version of the Play Services library - [see here](https://developers.google.com/android/guides/releases) for a list recent versions.
So this plugin enables you to specify other versions of the Play Services library using the `PLAY_SERVICES_VERSION` plugin variable.
 
For example, if you want to install v10 of the Play Services library, you'd specify the version via the variable:

    cordova plugin add cordova-android-play-services-gradle-release --variable PLAY_SERVICES_VERSION=10.+
    
# Example

Uses v10 of the Play Services library to fix the build issue.

1. `cordova create test1 && cd test1/`
2. `cordova platform add android@latest`
3. `cordova plugin add phonegap-plugin-push@1.10.3`
4. `cordova compile`

Observe the build succeeds and in the console output is `v10.2.6` of Play Services library:

    :prepareComGoogleAndroidGmsPlayServicesBase1026Library

5. `cordova plugin add cordova-plugin-googleplus@5.1.1`
6. `cordova compile`

Observe the build failed and in the console output is higher than `v10.2.6` (e.g `v11`) of Play Services library:

    :prepareComGoogleAndroidGmsPlayServicesBase1100Library

7. `cordova plugin add cordova-android-play-services-gradle-release --variable PLAY_SERVICES_VERSION=10.+`
8. `cordova prepare && cordova compile`

Observe the build succeeds and in the console output is v10 of Play Services library.

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