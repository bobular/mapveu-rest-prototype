// A function which takes a superclass as a parameter and returns a subclass
// extending that superclass.
let RecordQueryMixin = (superclass) => class extends superclass {
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
};

exports.RecordQueryMixin = RecordQueryMixin;
