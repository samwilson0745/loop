const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withWindowsNinjaPaths(config) {
  return withAppBuildGradle(config, (mod) => {
    const marker = 'defaultConfig {';
    const setting = 'defaultConfig {\n        externalNativeBuild { cmake { arguments "-DCMAKE_OBJECT_PATH_MAX=240" } }';
    if (mod.modResults.contents.includes(marker) && !mod.modResults.contents.includes('CMAKE_OBJECT_PATH_MAX')) {
      mod.modResults.contents = mod.modResults.contents.replace(marker, setting);
    }
    return mod;
  });
};
