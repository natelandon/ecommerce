const { src, dest, series } = require("gulp");
const rimraf = require("rimraf");

function clean(cb) {
  rimraf("apps/**/dist", () => {
    rimraf("packages/**/dist", cb);
  });
}

function noop(cb) {
  cb();
}

exports.clean = clean;
exports.build = series(noop);
