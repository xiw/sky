// Scale RA from [0, 24] to [-180, 180].
// Dec remains [-90, 90].
exports.geoRADec = function(ra, dec) {
  if (Array.isArray(ra))
    ra = makeRA.apply(null, ra);
  if (Array.isArray(dec))
    dec = makeDec.apply(null, dec);
  return [180 - 15 * ra, dec];
};

exports.makeRA = makeRA;

function makeRA(h, m, s) {
  if (arguments.length === 1)
    return +arguments[0];
  return (+h) + (+m) / 60 + (+s) / 3600; 
}

exports.makeDec = makeDec;

function makeDec(sign, d, m, s) {
  if (arguments.length === 1)
    return +arguments[0];
  var v = (+d) + (+m) / 60 + (+s) / 3600;
  if (sign === "-")
    v = -v;
  return v;
}
