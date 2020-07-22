"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const assert = require("assert");

const log = require("./utils/log");

const babel = require("@babel/core");

const _require = require("path"),
      extname = _require.extname;

const chalk = require("chalk");

const getBabelConfig = require("./getBabelConfig");

const _require2 = require("./utils/slash"),
      slash = _require2.slash,
      addLastSlash = _require2.addLastSlash;

const cwd = process.cwd();

function babelTransform(opts = {}) {
  const content = opts.content,
        path = opts.path,
        pkg = opts.pkg,
        root = opts.root;
  assert(content, `opts.content should be supplied for transform()`);
  assert(path, `opts.path should be supplied for transform()`);
  assert(pkg, `opts.pkg should be supplied for transform()`);
  assert(root, `opts.root should be supplied for transform()`);
  assert([".js", ".ts"].includes(extname(path)), `extname of opts.path should be .js, .ts or .tsx`);

  const _ref = pkg.umiTools || {},
        browserFiles = _ref.browserFiles;

  const isBrowser = browserFiles && browserFiles.includes(slash(path).replace(`${addLastSlash(slash(root))}`, ""));
  const babelConfig = getBabelConfig(isBrowser, path);
  log.transform(chalk[isBrowser ? "yellow" : "blue"](`${slash(path).replace(`${cwd}/`, "")}`));
  return babel.transform(content, _objectSpread(_objectSpread({}, babelConfig), {}, {
    filename: path
  })).code;
}

module.exports = babelTransform;