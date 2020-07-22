"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function babelConfig(isBrowser, path) {
  const targets = isBrowser ? {
    browsers: ["last 2 versions", "IE 10"]
  } : {
    node: 6
  };
  return {
    presets: [[require.resolve("@babel/preset-typescript"), {}], [require.resolve("@babel/preset-env"), _objectSpread({
      targets
    }, isBrowser ? {
      modules: false
    } : {})], ...(isBrowser ? [require.resolve("@babel/preset-react")] : [])],
    plugins: [require.resolve("@babel/plugin-proposal-export-default-from"), require.resolve("@babel/plugin-proposal-do-expressions"), require.resolve("@babel/plugin-proposal-class-properties")]
  };
}

module.exports = babelConfig;