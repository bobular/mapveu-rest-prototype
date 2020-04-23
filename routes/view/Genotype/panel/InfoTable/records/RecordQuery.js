const { ViewQuery } = require('../../../ViewQuery.js');
const { RecordQueryMixin } = require('../../../../RecordQueryMixin');

class RecordQuery extends RecordQueryMixin(ViewQuery) {}

exports.RecordQuery = RecordQuery;
