const { ViewQuery } = require('../../../ViewQuery.js');

// warning - /view/Sample/panel/InfoTable/records/RecordQuery.js and
//           /view/Genotype/panel/InfoTable/records/RecordQuery.js and
// are identical
// they inherit from different ViewQuery though
// can we solve this elegantly with mixins?
//
class RecordQuery extends ViewQuery {

  parseQueryParams() {
    super.parseQueryParams();
    const params = this.queryParams;

    // handle paging - >>TO DO<<
    // e.g from params.rows and params.start or params.cursor 
    this.query.rows(10);

    // set field list (fields in response)
    // TO DO sanitize/check params.fields
    // query.fl seems to accept either comma-delimited string or an array of strings
    this.query.fl(params.fields);
    
  }
  
  parseResponse(response) {
    return response.response.docs;
  }
}

exports.RecordQuery = RecordQuery;
