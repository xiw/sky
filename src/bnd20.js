exports.bnd20 = bnd20;

function bnd20() {
  var map = d3.map();
  return {
    row: function(line) {
      var arr = line.match(/\S+/g);
      var pt = exports.geoRADec([arr[0]], [arr[1]]);
      var abbr = arr[2];
      var coords = map.get(abbr);
      if (coords)
        coords.push(pt);
      else
        map.set(abbr, [pt]);
    },
    json: function() {
      var features = map.entries().map(function(e) {
        var coords = e.value;
        // Close the ring.
        if (coords[0] != coords[-1])
          coords.push(coords[0]);
        return {
          type: "Feature",
          id: e.key,
          geometry: {
            type: "Polygon",
            coordinates: [coords]
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

bnd20.parse = function(s) {
  var p = bnd20();
  s.split("\n").forEach(function(line) {
    if (line.length)
      p.row(line);
  });
  return p.json();
};
