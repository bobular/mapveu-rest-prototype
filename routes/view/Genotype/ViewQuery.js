const { SolrQuery } = require('../SolrQuery.js');

/*
  This sets up a generic Solr Querier for Sample View.
  It defines the filters that are applied to any query in this view
  (e.g. marker data, timeline data, sample records for details view)
 */

class ViewQuery extends SolrQuery {

    setFilters() {
      [ "bundle:pop_sample_genotype",
	"has_geodata:true",
	"-sample_size_i:0",
	"sample_size_i:*",
	'genotype_type_s:"mutated protein"',
	"genotype_cvterms:variant_frequency",
	"genotype_mutated_protein_unit_s:percent"
      ].forEach((filter) => this.query.addParams([ {field: "fq", value: filter }]));
    }

}

exports.ViewQuery = ViewQuery;
