exports.radiusFromVmag = function(d) {
  if (d.properties === undefined)
    return undefined;
  var r = 1;
  var base = 7;
  var vmag = d.properties.vmag;
  if (vmag <= 0)
    r = base - vmag;
  else if (vmag < base - 1)
    r = base - vmag;
  r = r * 0.6;
  return r;
};

// Compute star color from spectral type.
exports.colorFromSpType = function(d) {
  var cls = d.properties.spType[0];
  var color = {
    "O": "#9db4ff",
    "B": "#aabfff",
    "A": "#cad8ff",
    "F": "#fbf8ff",
    "G": "#fff4e8",
    "K": "#ffddb4",
    "M": "#ffbd6f",
  }[cls];
  return color || "white";
};
