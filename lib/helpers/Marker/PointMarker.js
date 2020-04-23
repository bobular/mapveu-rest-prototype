const { Marker } = require('../Marker.js');

class PointMarker extends Marker {

  // TO DO: probably parameterise the geohash_7
  
  // facet statistics needed by all PointMarker subclasses
  static commonGeoFacetStats() {
    return `ltAvg:"avg(geo_coords_ll_0_coordinate)",
      ltMin: "min(geo_coords_ll_0_coordinate)",
      ltMax: "max(geo_coords_ll_0_coordinate)",
      lnAvg: "avg(geo_coords_ll_1_coordinate)",
      lnMin: "min(geo_coords_ll_1_coordinate)",
      lnMax: "max(geo_coords_ll_1_coordinate)",
      atomicCount: "unique(geohash_7)"`;
  }
}

exports.PointMarker = PointMarker;
