// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback-next
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const path = require('path');
const fs = require('fs-extra');

const Project = require('@lerna/project');

/**
 * Get a list of lerna packages with the optional filter function
 * @param {*} filter - Filter function
 */
async function getPackages(filter = () => true) {
  // List all packages within the monorepo
  const project = new Project(process.cwd());
  const packages = await project.getPackages();
  return packages.filter(filter);
}

/**
 * Load a lerna monorepo
 */
async function loadLernaRepo() {
  // List all packages within the monorepo
  const project = new Project(process.cwd());
  const packages = await project.getPackages();
  return {project, packages};
}

/**
 * Write a json object into the file
 * @param {*} file - File path/name
 * @param {*} json - JSON object
 */
function writeJsonSync(file, json) {
  return fs.writeJsonSync(file, json, {encoding: 'utf-8', spaces: 2});
}

/**
 * Check if it's in `dryRun` mode
 * @param {*} options - Options object
 */
function isDryRun(options) {
  if (options != null) return !!options.dryRun;
  const dryRun = process.argv.slice(2).includes('--dry-run');
  return dryRun;
}

/**
 * Check if two json objects are equal
 * @param {*} obj1 - First json object
 * @param {*} obj2 - Second json object
 */
function isJsonEqual(obj1, obj2) {
  return obj1 === obj2 || JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * Clone a json object
 * @param {*} obj - json object
 */
function cloneJson(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Print stringified json
 * @param {*} obj - json object
 */
function printJson(obj) {
  console.log(stringifyJson(obj));
}

/**
 * Stringify JSON object
 * @param {*} obj - json object
 */
function stringifyJson(obj) {
  return JSON.stringify(obj, null, 2);
}

/**
 * Check if a package is TypeScript project
 * @param {object} pkg - Lerna package
 */
function isTypeScriptPackage(pkg) {
  return fs.existsSync(path.join(pkg.location, 'tsconfig.json'));
}

/**
 * Run an async function
 * @param {*} asyncFn - An async function
 * @param {*} args - Arguments
 */
function main(currentModule, asyncFn, ...args) {
  if (require.main === currentModule) {
    asyncFn(...args).then(
      result => {
        if (result != null) {
          console.log(result);
        }
      },
      err => {
        console.error(err);
        process.exit(1);
      },
    );
  }
}

exports.loadLernaRepo = loadLernaRepo;
exports.isDryRun = isDryRun;
exports.getPackages = getPackages;
exports.isJsonEqual = isJsonEqual;
exports.cloneJson = cloneJson;
exports.printJson = printJson;
exports.isTypeScriptPackage = isTypeScriptPackage;
exports.writeJsonSync = writeJsonSync;
exports.stringifyJson = stringifyJson;
exports.main = main;
