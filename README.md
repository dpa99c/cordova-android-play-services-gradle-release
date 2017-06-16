cordova-android-play-services-gradle-release
======================================

This Cordova/Phonegap plugin for Android aligns various versions of the Play Services library specified by other plugins to the latest release (or a specific) version.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Purpose](#purpose)
- [Installation](#installation)
- [Different library versions](#different-library-versions)
  - [Default version](#default-version)
  - [Other versions](#other-versions)
- [Example](#example)
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

If you're encountering similar problems with the Android Support libraries, checkout the sister plugin: [cordova-android-support-gradle-release](https://github.com/dpa99c/cordova-android-support-gradle-release).

# Installation

    $ cordova plugin add cordova-android-play-services-gradle-release
    
Just install the plugin and that's it. It should fix should build.

# Different library versions

## Default version
By default, the `master` branch of this repo and corresponding npm release, will be made to specify the most major version of the most recent release of the Play Services library - [see here](https://developers.google.com/android/guides/releases) for a list recent versions.

## Other versions

In some cases, you may want to specify a different version of the Play Services library. 
So this plugin provides branches for various older major versions of the Play Services library.
 
Because Cordova doesn't support tags in plugins sourced from npm, you'll need to install this version directly from the git repo:

    cordova plugin add https://github.com/dpa99c/cordova-android-play-services-gradle-release#v10
    
The following branches currently exist:
    
- [master](https://github.com/dpa99c/cordova-android-play-services-gradle-release) (default)
    - The most recent major release
    - Currently uses `11.+`
    - Install with: `cordova plugin add cordova-android-play-services-gradle-release`
    - Or: `https://github.com/dpa99c/cordova-android-play-services-gradle-release`
- [edge](https://github.com/dpa99c/cordova-android-play-services-gradle-release/tree/edge)
    - The most recent release
    - Uses `+`
    - Install with: `cordova plugin add https://github.com/dpa99c/cordova-android-play-services-gradle-release#edge`
- [v11](https://github.com/dpa99c/cordova-android-play-services-gradle-release/tree/v11)
    - The highest v11 version
    - Uses `11.+`
    - Install with: `cordova plugin add https://github.com/dpa99c/cordova-android-play-services-gradle-release#v11`
- [v10](https://github.com/dpa99c/cordova-android-play-services-gradle-release/tree/v10)
    - The highest v10 version
    - Uses `10.+`
    - Install with: `cordova plugin add https://github.com/dpa99c/cordova-android-play-services-gradle-release#v10`
- [v9](https://github.com/dpa99c/cordova-android-play-services-gradle-release/tree/v9)
    - The highest v9 version
    - Uses `9.+`
    - Install with: `cordova plugin add https://github.com/dpa99c/cordova-android-play-services-gradle-release#v9`
    
# Example

Forces the latest release version of the Play Services library to fix the build issue.

1. `cordova create test1 && cd test1/`
2. `cordova platform add android@latest`
3. `cordova plugin add phonegap-plugin-push@1.10.3`
4. `cordova compile`

Observe the build succeeds and in the console output is `v10.2.6` of Play Services library:

    :prepareComGoogleAndroidGmsPlayServicesBase1026Library

5. `cordova plugin add cordova-plugin-googleplus@5.1.1`
6. `cordova compile`

Observe the build failed and in the console output is higher than `v10.2.6` (e.g `v11.0.0`) of Play Services library:

    :prepareComGoogleAndroidGmsPlayServicesBase1100Library

7. `cordova plugin add cordova-android-play-services-gradle-release`
8. `cordova compile`    

Observe the build succeeds and in the console output is latest release version of Play Services library.

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