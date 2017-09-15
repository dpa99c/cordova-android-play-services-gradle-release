var fs      = require ('fs');
var path    = require('path');
var parser  = require('xml2js');

const PLUGIN_NAME         = "cordova-android-play-services-gradle-release";
const GRADLE_FILENAME     = path.resolve(process.cwd(), 'platforms', 'android', PLUGIN_NAME, 'properties.gradle');
const PROPERTIES_TEMPLATE = 'ext {PLAY_SERVICES_VERSION = "<VERSION>"}'

// 1. Parse cordova.xml file and fetch this plugin's <variable name="PLAY_SERVICES_VERSION" />
fs.readFile(path.resolve(process.cwd(), 'config.xml'), function(err, data) {
  var json = parser.parseString(data, function(err, result) {
    if (err) {
      return console.log(PLUGIN_NAME, " ERROR: ", err);
    }
    var plugins = result.widget.plugin;
    if(!plugins || plugins.length === 0) return;
    for (var n=0,len=plugins.length;n<len;n++) {
      var plugin = plugins[n];
      if (plugin.$.name === PLUGIN_NAME) {
        if (!plugin.variable.length) {
          return console.log(PLUGIN_NAME, ' ERROR: FAILED TO FIND <variable name="PLAY_SERVICES_VERSION" /> in config.xml');
        }
        // 2.  Update .gradle file.
        setGradleVersion(plugin.variable.pop().$.value);
        break;
      }
    }
  });
});

/**
* Write properties.gradle with:
*
ext {
  PLAY_SERVICES_VERSION = '<VERSION>'
}
*
*/
function setGradleVersion(version) {
  console.log(PLUGIN_NAME, " PLAY_SERVICES_VERSION: ", version);
  fs.writeFile(GRADLE_FILENAME, PROPERTIES_TEMPLATE.replace(/<VERSION>/, version), 'utf8', function (err) {
     if (err) return console.log(PLUGIN_NAME, " FAILED TO WRITE ", GRADLE_FILENAME, " > ", PLAY_SERVICES_VERSION, err);
  });
}





