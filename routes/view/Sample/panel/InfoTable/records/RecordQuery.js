const { ViewQuery } = require('../../../ViewQuery.js');

class RecordQuery extends ViewQuery {
  constructor(solr, query) {
    super(solr, query);
    this.query.rows(10);
  }

  parseResponse(response) {
    return response.response.docs.map((doc) => ({ sampleID: doc.sample_id_s,
                                                  sampleType: doc.sample_type,
                                                  locations: doc.geolocations
                                                }));
  }
}

exports.RecordQuery = RecordQuery;
