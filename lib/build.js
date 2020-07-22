"use strict";

const assert = require("assert");

const yParser = require("yargs-parser");

const _require = require("fs"),
      existsSync = _require.existsSync,
      statSync = _require.statSync,
      readdirSync = _require.readdirSync;

const _require2 = require("path"),
      join = _require2.join,
      extname = _require2.extname,
      sep = _require2.sep;

const rimraf = require("rimraf");

const vfs = require("vinyl-fs");

const through = require("through2");

const chokidar = require("chokidar");

const babelTransform = require("./getBabelTransform");

const log = require("./utils/log");

const cwd = process.cwd();
let pkgCount = null;

function build(dir, opts = {}) {
  const cwd = opts.cwd,
        watch = opts.watch;
  assert(dir.charAt(0) !== "/", `dir should be relative`);
  assert(cwd, `opts.cwd should be supplied`);
  const pkgPath = join(cwd, dir, "package.json");
  assert(existsSync(pkgPath), "package.json should exists");

  const pkg = require(pkgPath);

  const libDir = join(dir, "lib");
  const srcDir = join(dir, "src"); // clean

  rimraf.sync(join(cwd, libDir));

  function createStream(src) {
    assert(typeof src === "string", `src for createStream should be string`);
    return vfs.src([src, `!${join(srcDir, "**/*.test.js")}`], {
      allowEmpty: true,
      base: srcDir
    }).pipe(through.obj((f, env, cb) => {
      if ([".js", ".ts"].includes(extname(f.path)) && !f.path.includes(`${sep}templates${sep}`)) {
        f.contents = Buffer.from(babelTransform({
          content: f.contents,
          path: f.path,
          pkg,
          root: join(cwd, dir)
        }));
        f.path = f.path.replace(extname(f.path), ".js");
      }

      cb(null, f);
    })).pipe(vfs.dest(libDir));
  } // build


  const stream = createStream(join(srcDir, "**/*"));
  stream.on("end", () => {
    pkgCount -= 1;

    if (pkgCount === 0 && process.send) {
      process.send("BUILD_COMPLETE");
    } // watch


    if (watch) {
      log.pending("start watch", srcDir);
      const watcher = chokidar.watch(join(cwd, srcDir), {
        ignoreInitial: true
      });
      watcher.on("all", (event, fullPath) => {
        const relPath = fullPath.replace(join(cwd, srcDir), "");
        log.watch(`[${event}] ${join(srcDir, relPath)}`);
        if (!existsSync(fullPath)) return;

        if (statSync(fullPath).isFile()) {
          createStream(fullPath);
        }
      });
    }
  });
}

function isLerna(cwd) {
  return existsSync(join(cwd, "lerna.json"));
}

const args = yParser(process.argv.slice(3));
const watch = args.w || args.watch;

if (isLerna(cwd)) {
  const dirs = readdirSync(join(cwd, "packages")).filter(dir => dir.charAt(0) !== ".");
  pkgCount = dirs.length;
  dirs.forEach(pkg => {
    build(`./packages/${pkg}`, {
      cwd,
      watch
    });
  });
} else {
  pkgCount = 1;
  build("./", {
    cwd,
    watch
  });
}