const { ViewQuery } = require('../../../ViewQuery.js');
const { CollectionCount } = require.main.require('./lib/mixins/Marker/CollectionCount');

class FacetQuery extends CollectionCount(ViewQuery) {}

exports.FacetQuery = FacetQuery;
