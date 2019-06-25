var PLUGIN_ID = "cordova-android-play-services-gradle-release";
var FILE_PATHS = {};
var DEBUG = false;
var versionMap = {};

var q, fs, path, semver, xml2js,
    pluginDeferral, parser;

function log(message) {
    console.log(PLUGIN_ID + ": " + message);
}

function debug(message) {
    if(DEBUG) console.log(`DEBUG: ${message}`);
}

function onError(error) {
    log("ERROR: " + error);
    pluginDeferral.resolve();
}

function run() {
    try {
        fs = require('fs');
        path = require('path');
        semver = require('semver');
        xml2js = require('xml2js');
        parser = new xml2js.Parser();
    } catch (e) {
        throw("Failed to load dependencies. If using cordova@6 CLI, ensure this plugin is installed with the --fetch option: " + e.toString());
    }

    var args = getArgs();
    if(args['verbose']){
        DEBUG = true;
        log('Debug logging enabled');
    }

    FILE_PATHS["config.xml"] = "./config.xml";
    FILE_PATHS["package.json"] = "./package.json";
    FILE_PATHS["/android"] = "./platforms/android";
    FILE_PATHS["/plugin"] = "./plugins/" + PLUGIN_ID;
    FILE_PATHS["build.gradle"] = FILE_PATHS["/android"]+"/app/build.gradle";
    FILE_PATHS["plugin.xml"] = FILE_PATHS["/plugin"] + "/plugin.xml";
    FILE_PATHS["component-map.json"] = FILE_PATHS["/plugin"] + "/component-map.json";
    FILE_PATHS["/override.gradle"] = FILE_PATHS["/android"]+"/"+PLUGIN_ID;

    parsePluginXml()
        .then(parseConfigXml)
        .then(parsePackageJson)
        .then(processPackages)
        .then(pluginDeferral.resolve);
}

// Load default versions from this plugin's plugin.xml
function parsePluginXml(){
    var deferral = q.defer();
    parser.parseString(fs.readFileSync(FILE_PATHS["plugin.xml"]), function (err, data) {
        if (err) {
            return pluginDeferral.reject(err);
        }
        var platform = data.plugin.platform[0];
        platform.preference.forEach(function (preference) {
            versionMap[preference.$.name] = preference.$.default;
            debug("plugin.xml - default version "+preference.$.name+"="+preference.$.default);
        });
        deferral.resolve();
    });
    return deferral.promise;
}

// Search config.xml for overrides
function parseConfigXml(){
    var deferral = q.defer();
    parser.parseString(fs.readFileSync(FILE_PATHS["config.xml"]), function (err, data) {
        if (err) {
            return pluginDeferral.reject(err);
        }
        (data.widget.plugin || []).forEach(function (plugin) {
            var pluginId = plugin.$.name || plugin.$.id;
            if(pluginId !== PLUGIN_ID) return;
            (plugin.variable || []).forEach(function (variable) {
                if(variable.$.name && variable.$.value){
                    var varName = variable.$.name.toLowerCase();
                    if(versionMap[varName]){
                        versionMap[varName] = variable.$.value;
                        debug("config.xml - override version "+varName+"="+variable.$.value);
                    }
                }
            });
        });
        deferral.resolve();
    });
    return deferral.promise;
}

// Search package.json for overrides
function parsePackageJson(){
    const deferred = q.defer();
    var packageJSON = JSON.parse(fs.readFileSync(FILE_PATHS["package.json"]));
    if(packageJSON.cordova && packageJSON.cordova.plugins){
        for(const pluginId in packageJSON.cordova.plugins){
            if(pluginId !== PLUGIN_ID) continue;
            for(var varName in packageJSON.cordova.plugins[pluginId]){
                var varValue = packageJSON.cordova.plugins[pluginId][varName];
                varName = varName.toLowerCase();
                if(versionMap[varName]){
                    versionMap[varName] = varValue;
                    debug("package.json - override version "+varName+"="+varValue);
                }
            }
        }
    }
    deferred.resolve();
    return deferred.promise;
}

function processPackages(){
    const deferred = q.defer();

    var buildGradle = fs.readFileSync(FILE_PATHS["build.gradle"]).toString(),
        componentMap = JSON.parse(fs.readFileSync(FILE_PATHS["component-map.json"]).toString());

    var version, packageId, libraryId, packagePatternStr, packagePatternRegExp, newPackageVersion,
        forceResolutionPackages = {},
        matches,
        shouldForceResolution = false;
    for(packageId in componentMap){
        if(!versionMap[packageId]){
            log("WARNING: no version found for package '"+packageId+"'");
            continue;
        }
        version = versionMap[packageId];
        libraryId = componentMap[packageId];
        packagePatternStr = libraryId+':'+packageId+':([\\d.+]+)';
        packagePatternRegExp = new RegExp(packagePatternStr, 'g');
        newPackageVersion = libraryId+':'+packageId+':'+version;

        // search build.gradle for packages
        matches = buildGradle.match(packagePatternRegExp);
        if(matches){
            matches.forEach(function(match){
                if(match === newPackageVersion) return;
                log("overriding "+match+" in build.gradle with "+newPackageVersion);
                shouldForceResolution = true;
                forceResolutionPackages[packageId] = newPackageVersion;
            });
        }
    }

    // Generate override gradle for found packages
    if(shouldForceResolution){
        var forceResolutionList = [];
        for(packageId in forceResolutionPackages){
            forceResolutionList.push("'"+forceResolutionPackages[packageId]+"'");
        }
        var forceResolutionString = forceResolutionList.join(', ');
        var overideGradle = "configurations.all {\
        \n    resolutionStrategy {\n\
        \n        force "+forceResolutionString+"\
        \n    }\
        \n}";

        var overrideGradleFileName = path.resolve(process.cwd(),FILE_PATHS["/override.gradle"]+"/"+fs.readdirSync(FILE_PATHS["/override.gradle"])[0]);
        fs.writeFileSync(overrideGradleFileName, overideGradle, 'utf8');
        debug("wrote Gradle override file : "+overrideGradleFileName);
    }

    deferred.resolve();
    return deferred.promise;
}

function attempt(fn) {
    return function () {
        try {
            fn.apply(this, arguments);
        } catch (e) {
            onError("EXCEPTION: " + e.toString());
            if(DEBUG) throw e;
        }
    }
}

function getArgs () {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
        // long arg
        if (arg.slice(0,2) === '--') {
        const longArg = arg.split('=');
        const longArgFlag = longArg[0].slice(2,longArg[0].length);
        const longArgValue = longArg.length > 1 ? longArg[1] : true;
        args[longArgFlag] = longArgValue;
    }
    // flags
else if (arg[0] === '-') {
        const flags = arg.slice(1,arg.length).split('');
        flags.forEach(flag => {
            args[flag] = true;
    });
    }
});
    return args;
}

module.exports = function (ctx) {
    try{
        q = require('q');
        pluginDeferral = q.defer();
    }catch(e){
        e.message = 'Unable to load node module dependency \'q\': '+e.message;
        log(e.message);
        throw e;
    }
    attempt(run)();
    return pluginDeferral.promise;
};
