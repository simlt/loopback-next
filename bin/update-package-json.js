#!/usr/bin/env node
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback-next
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/**
 * This is an internal script that will verify that all packages in our monorepo
 * are registered in all required places and have the expected metadata in their
 * package.json.
 */
'use strict';

const path = require('path');
const fs = require('fs-extra');

const Project = require('@lerna/project');

/**
 * Check all required fields of package.json for each package on the matching
 * with root package.json
 * @param {Package[]} packages A list of @lerna/project packages
 * @param {Object} rootPkg A root package.json
 */
async function updatePackageJsonFiles(options) {
  const project = new Project(process.cwd());
  const packages = await project.getPackages();
  const rootPath = project.rootPath;
  const rootPkg = fs.readJsonSync(path.join(rootPath, 'package.json'));

  for (const p of packages) {
    const pkgFile = path.join(p.location, 'package.json');
    const pkg = fs.readJsonSync(pkgFile);
    const current = JSON.stringify(pkg, null, 2);

    const isTypescriptPackage = fs.existsSync(
      path.join(p.location, 'tsconfig.json'),
    );

    const isLernaRepo = fs.existsSync(path.join(p.location, 'lerna.json'));

    if (isTypescriptPackage && !isLernaRepo) {
      pkg.main = 'dist/index.js';
      pkg.types = 'dist/index.d.ts';
    }

    if (!pkg.private) {
      pkg.publishConfig = {
        access: 'public',
      };
    }

    pkg.author = rootPkg.author;
    pkg['copyright.owner'] = getCopyrightOwner(rootPkg);
    pkg.license = rootPkg.license;

    pkg.repository = {
      type: rootPkg.repository.type,
      url: rootPkg.repository.url,
      directory: path.relative(p.rootPath, p.location).replace(/\\/g, '/'),
    };

    pkg.engines = rootPkg.engines;
    const updated = JSON.stringify(pkg, null, 2);
    if (updated !== current) {
      if (options && options.dryRun) {
        console.log(updated);
      } else {
        console.log('%s is updated.', path.relative(p.rootPath, pkgFile));
        fs.writeFileSync(pkgFile, updated + '\n', {encoding: 'utf-8'});
      }
    }
  }
}

function getCopyrightOwner(pkg) {
  return pkg['copyright.owner'] || (pkg.copyright && pkg.copyright.owner);
}

if (require.main === module) {
  const dryRun = process.argv.slice(2).includes('--dry-run');
  updatePackageJsonFiles({dryRun}).catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}
