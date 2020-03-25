const { ViewQuery } = require('../../../ViewQuery.js');

class RecordQuery extends ViewQuery {
  constructor(solr, query) {
    super(solr, query);
    this.query.rows(10);
  }

  parseResponse(response) {
    return response.response.docs.map((doc) => ({ id: doc.id,
                                                  sampleType: doc.sample_type,
						  genotypeType: doc.genotype_type_s,
						  genotypeName: doc.genotype_name_s
                                                }));
  }
}

exports.RecordQuery = RecordQuery;
