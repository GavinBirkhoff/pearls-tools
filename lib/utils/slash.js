"use strict";

exports.addLastSlash = path => {
  return path.slice(-1) === "/" ? path : `${path}/`;
};

exports.slash = input => {
  const isExtendedLengthPath = /^\\\\\?\\/.test(input);

  if (isExtendedLengthPath) {
    return input;
  }

  return input.replace(/\\/g, "/");
};