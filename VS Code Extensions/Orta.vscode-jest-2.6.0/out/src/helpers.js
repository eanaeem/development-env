"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const fs_1 = require("fs");
const path_1 = require("path");
/**
 *  Handles getting the jest runner, handling the OS and project specific work too
 *
 * @returns {string}
 */
function pathToJest(pluginSettings) {
    const path = path_1.normalize(pluginSettings.pathToJest);
    const defaultPath = path_1.normalize('node_modules/.bin/jest');
    if (path === defaultPath && isBootstrappedWithCreateReactApp(pluginSettings.rootPath)) {
        // If it's the default, run the script instead
        return os_1.platform() === 'win32' ? 'npm.cmd test --' : 'npm test --';
    }
    // For windows support, see https://github.com/jest-community/vscode-jest/issues/10
    if (!path.includes('.cmd') && os_1.platform() === 'win32') {
        return path + '.cmd';
    }
    return path;
}
exports.pathToJest = pathToJest;
function isBootstrappedWithCreateReactApp(rootPath) {
    return (hasExecutable(rootPath, 'node_modules/.bin/react-scripts') ||
        hasExecutable(rootPath, 'node_modules/react-scripts/node_modules/.bin/jest') ||
        hasExecutable(rootPath, 'node_modules/react-native-scripts') ||
        hasExecutable(rootPath, 'node_modules/react-scripts-ts'));
}
function hasExecutable(rootPath, executablePath) {
    const ext = os_1.platform() === 'win32' ? '.cmd' : '';
    const absolutePath = path_1.join(rootPath, executablePath + ext);
    return fs_1.existsSync(absolutePath);
}
/**
 * Handles getting the path to config file
 *
 * @returns {string}
 */
function pathToConfig(pluginSettings) {
    if (pluginSettings.pathToConfig !== '') {
        return path_1.normalize(pluginSettings.pathToConfig);
    }
    return '';
}
exports.pathToConfig = pathToConfig;
function pathToJestPackageJSON(pluginSettings) {
    let pathToNodeModules = path_1.join(pluginSettings.rootPath, 'node_modules');
    if (pluginSettings.pathToJest) {
        const relativeJestCmd = removeSurroundingQuotes(pluginSettings.pathToJest.split(' ')[0]);
        const relativePathToNodeModules = relativeJestCmd.replace(/node_modules.+$/i, 'node_modules');
        pathToNodeModules = path_1.join(pluginSettings.rootPath, relativePathToNodeModules);
    }
    const defaultPath = path_1.normalize(path_1.join(pathToNodeModules, 'jest/package.json'));
    const craPath = path_1.normalize(path_1.join(pathToNodeModules, 'react-scripts/node_modules/jest/package.json'));
    const paths = [defaultPath, craPath];
    for (const i in paths) {
        if (fs_1.existsSync(paths[i])) {
            return paths[i];
        }
    }
    return null;
}
exports.pathToJestPackageJSON = pathToJestPackageJSON;
function removeSurroundingQuotes(str) {
    return str.replace(/^['"`]/, '').replace(/['"`]$/, '');
}
//# sourceMappingURL=helpers.js.map