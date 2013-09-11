exports.asterism = asterism;

function asterism(map) {
  features = [];
  return {
    rows: function(name, s) {
      lines = [];
      s.split("\n").forEach(function(row) {
        if (!row.length)
          return;
        var line = row.split("--")
          .map(function(_) { return map.get(_.trim()); })
          .filter(function(_) { return _; });
        lines.push(line);
      });
      features.push({
        type: "Feature",
        geometry: {
          type: "MultiLineString",
          coordinates: lines
        },
        properties: {
          name: name
        }
      });
      return this;
    },
    json: function() {
      return {
        type: "FeatureCollection",
        features: features
      };
    }
  };
}
