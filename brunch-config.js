// Originally created by Antoine Beauvais-Lacasse

// See http://brunch.io for documentation.
// noinspection NpmUsedModulesInstalled (Included with Brunch)
const logger = require('loggy');
const globby = require('globby');
const path = require('path');
const fs = require('fs');

const humanReadableFileSizeSI = require('./src/js/utils/human-readable-file-size-si');


const modulesRoot = path.resolve(__dirname, 'lib', 'modules');
const outputRoot = path.resolve(modulesRoot, 'apostrophe-assets', 'public');

const jsFilePattern = path.join(modulesRoot, '**', 'src', '**', '*.js');

const jsSources = globby.sync(jsFilePattern).map(x => path.relative(__dirname, x));

const jsSourceDirs = [...(new Set(jsSources.map(x => path.dirname(x))))];

const perModuleJsTargets = jsSources.reduce(
  (acc, source) => {
    const targetFile = path.relative(
      outputRoot,
      source.replace('/src/', '/public/')
    );

    acc[targetFile] = source;
    return acc;
  },
  {}
);


exports.files = {
  javascripts: {
    joinTo: {
      'js/site.js': /^(src|node_modules)/,
      ...perModuleJsTargets
    }
  },
  stylesheets: {
    joinTo: {
      'css/site.css': /^src/
    }
  }
};

exports.paths = {
  public: outputRoot,
  watched: [
    'src',
    ...jsSourceDirs
  ]
};

exports.plugins = {
  babel: {
    'presets': [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'entry',
          corejs: 3
        }
      ]
    ]
  },
  sass: {
    precision: 4
  },
  terser: {
    warnings: true,
    module: true,
    compress: {
      keep_fnames: /require/,
      module: true,
      pure_getters: true
    },
    mangle: {
      keep_fnames: /require/,
      module: true
    }
  }
};

exports.modules = {
  nameCleaner: path => path.replace(/^src\/js\//, '')
                           .replace(/.js$/, ''),
  autoRequire: {
    'js/site.js': ['initialize']
  }
};

exports.server = {
  path: 'brunch-server.js'
};


let cachedStyleReloader;
let isSubsequentCompile = false;

function getOrCreateStyleReloader() {
  if (cachedStyleReloader) {
    return cachedStyleReloader;
  }
  const serverLoader = require('./brunch-server');
  const aposRoot = serverLoader.aposRoot;
  if (aposRoot) {
    const aposAssets = aposRoot.modules['apostrophe-assets'];

    return cachedStyleReloader = require('util').promisify(
      cb => {
        aposAssets.generation = `AEM_DEV_${Date.now()}`;
        return aposAssets.buildLessMasters(cb);
      }
    );
  }
  return () => Promise.resolve();
}

exports.hooks = {
  onCompile(generatedFiles, changedAssets) {

    generatedFiles.forEach(
      ({ path: filePath }) => {
        const fileName = path.basename(filePath);
        const fileSize = humanReadableFileSizeSI(fs.statSync(filePath).size);
        logger.info(`${ fileName }: ${ fileSize }`);
      }
    );

    if (isSubsequentCompile && generatedFiles.some(f => f.path.endsWith('.css'))) {
      logger.info('Reloading styles...');
      return getOrCreateStyleReloader()();
    } else {
      isSubsequentCompile = true;
      return Promise.resolve();
    }

  }
};
