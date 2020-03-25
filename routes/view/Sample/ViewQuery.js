const { SolrQuery } = require('../SolrQuery.js');

/*
  This specialises the Solr Querier for this particular View.
  It defines the filters that are applied to any query in this view
  (e.g. marker data, timeline data, sample records for details view)
 */

class ViewQuery extends SolrQuery {

    setFilters() {
        this.query.addParams([ {field: "fq", value: "bundle:pop_sample"},
                               {field: "fq", value: "has_geodata:true"},
                               {field: "fq", value: "-sample_size_i:0"} ]);
    }

}

exports.ViewQuery = ViewQuery;
