const { ViewQuery } = require('../../../ViewQuery.js');
const { PointMarker } = require('../../../../../../lib/Marker/PointMarker.js');


class FacetQuery extends ViewQuery {
  constructor(solr, query) {
    super(solr, query);
    this.query.rows(0);
  }

  parseQueryParams() {
    super.parseQueryParams();
    const params = this.queryParams;

    // outer facet on geography
    const geoField = params.geoField;
    // inner facet on a category such as species or collection_protocol
    const catField = params.catField;

    const commonGeoFacetStats = PointMarker.commonGeoFacetStats();

    if (geoField && catField) {
      this.query.addParams([ { 
        field: "json.facet",
        value:
	`{
  geo: {
    type: "terms",
    field: "${geoField}",
    limit: -1,
    mincount: 1,

    facet: {
      ${commonGeoFacetStats},

      cat: {
        type: "terms",
        field: "${catField}",
        limit: -1,
        mincount: 1
      }
    }
  }
}`
      } ]);

    } else {
      console.log("Error: one or both facet fields not given");
      // TO DO: proper error handling
    }

  }
  
  parseResponse(response) {
    return response.facets;
  }

}

exports.FacetQuery = FacetQuery;
