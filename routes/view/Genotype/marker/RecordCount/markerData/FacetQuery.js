const { ViewQuery } = require('../../../ViewQuery.js');
const { FacetQueryMixin } = require('../../../../FacetQueryMixin');

class FacetQuery extends FacetQueryMixin(ViewQuery) {}

exports.FacetQuery = FacetQuery;
