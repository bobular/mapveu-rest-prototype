const { ViewQuery } = require('../../../ViewQuery.js');
const { RecordCount } = require.main.require('./lib/mixins/Marker/RecordCount');

class FacetQuery extends RecordCount(ViewQuery) {}

exports.FacetQuery = FacetQuery;
