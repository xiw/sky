exports.bsc5p = bsc5p;

function greek(s) {
  return {
    Alp: "α",
    Bet: "β",
    Gam: "γ",
    Del: "δ",
    Eps: "ε",
    Zet: "ζ",
    Eta: "η",
    The: "θ",
    Iot: "ι",
    Kap: "κ",
    Lam: "λ",
    Mu : "μ",
    Nu : "ν",
    Xi : "ξ",
    Omi: "ο",
    Pi : "π",
    Rho: "ρ",
    Sig: "σ",
    Tau: "τ",
    Ups: "υ",
    Phi: "φ",
    Chi: "χ",
    Psi: "ψ",
    Ome: "ω",
  }[s];
}

function bsc5p() {
  var objects = [];
  return {
    data: function() {
      if (!arguments.length)
        return objects;
      objects = arguments[0];
      return this;
    },
    row: function(line) {
      var RAh = line.substr(75, 2),
          RAm = line.substr(77, 2),
          RAs = line.substr(79, 2),
          DE_ = line.charAt(83),
          DEd = line.substr(84, 2), 
          DEm = line.substr(86, 2),
          DEs = line.substr(88, 2),
          spType = line.substring(127, 147).trim(),
          vmag = line.substring(102, 107).trim(),
          flamsteed = line.substring(4, 7).trim(),
          bayer = line.substr(7, 3).trim(),
          bayer_sup = line.charAt(10).trim(),
          constellation = line.substring(11, 14).trim(),
          hd = line.substring(25, 31).trim(),
          sao = line.substring(31, 37).trim(),
          id,
          names = [];
      // Skip if no RA.
      if (!RAh.trim().length)
        return;
      // Collect names.
      var collect = function(s) {
        id = s;
        names.push(s);
      };
      if (sao.length)
        collect("SAO " + sao);
      if (hd.length)
        collect("HD " + hd);
      if (constellation.length) {
        if (flamsteed.length)
          collect(flamsteed + " " + constellation);
        if (bayer.length)
          collect(greek(bayer) + bayer_sup + " " + constellation);
      }
      objects.push({
        id: id,
        ra: [RAh, RAm, RAs],
        dec: [DE_, DEd, DEm, DEs],
        vmag: +vmag,
        spType: spType,
        names: names,
      });
    },
    json: function() {
      var features = objects.map(function(_) {
        return {
          type: "Feature",
          id: _.id,
          geometry: {
            type: "Point",
            coordinates: exports.geoRADec(_.ra, _.dec)
          },
          properties: {
            vmag: _.vmag,
            spType: _.spType
          }
        };
      });
      return {
        type: "FeatureCollection",
        features: features
      };
    }
  };
}

bsc5p.parse = function(s) {
  var p = bsc5p();
  s.split("\n").forEach(function(line) {
    if (line.length)
      p.row(line);
  });
  return p.json();
};
