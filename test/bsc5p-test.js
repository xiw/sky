var fs = require("fs"),
    sky = require("..");

var chunk = fs.readFileSync(__dirname + "/../data/bsc5p.txt").toString();
var json = sky.bsc5p.parse(chunk).features;

exports.testSirius = function(test) {
  var feature = json.filter(function(_) {
    return _.id === "α CMa";
  })[0];
  test.equal(feature.properties.vmag, -1.46);
  test.equal(feature.properties.spType.substr(0, 3), "A1V");
  test.done();
};

exports.testVega = function(test) {
  var feature = json.filter(function(_) {
    return _.id === "α Lyr";
  })[0];
  test.equal(feature.properties.vmag, 0.03);
  test.equal(feature.properties.spType.substr(0, 3), "A0V");
  test.done();
};
