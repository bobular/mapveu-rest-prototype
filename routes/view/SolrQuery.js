class SolrQuery {
  constructor(solr, query) {
    this.solr = solr;
    this.queryParams = query;

    this.query = solr.query();
    this.query.wt("json");
    console.log("TO DO: make sure all query params are sanitised to avoid injection attacks");
  }


  setQuery(queryString) {
    console.log("Warning: Solr syntax expected for q parameter. Not yet abstracted away...");
    // Need to allow Boolean logic and groupings. see my tweet asking for help
    // https://twitter.com/uncoolbob/status/1240362063840661505
    // hopefully there's some existing standard.
    //
    // also ask within VEuPath
    // Could expect to check for allowed fields in the child classes (ViewQuery)
    // So parse here and call this.validateQueryField() as you go along?
    if (queryString) {
      this.query.q(queryString);
    } else {
      this.query.q("*:*");
    }
  }

  // must implement this in ViewQuery children
  validateQueryField(fieldName) {
    return true;
  }

  // the client will typically pass a bounding box filter but keeping the naming open
  // to allow for polygons or geohash or admin region fields.
  setGeoFilter(geoFilterString) {
    console.log("Warning: Solr syntax expected for gf parameter. Not yet abstracted away...");
    // API ought to expect GeoJSON Feature format here.  For geometric filters, self explanatory.
    // For placename based filters, GeoJSON features can have geometry:null and properties:
    // { admin1 : "Ohio" } or { geohash_2: "2x" } - these seem a bit tied to the VB schema
    // but maybe these field names will come from the configuration.
    if (geoFilterString) {
      this.query.addParams([ {field: "fq", value: geoFilterString} ]);
    }
  }


  // this handles all the query parameters coming in from the request URL,
  // e.g. query and geoFilter in /foo/bar/endpoint?query=abc&geoFilter=xyz
  // presumably, it will also handle paging and rows
  // subclasses will handle return-fields, facet fields etc.
  parseQueryParams() {
    const params = this.queryParams;
    this.setQuery(params.query);
    this.setGeoFilter(params.geoFilter);
    // ...
  }
  
  setFilters() {
    throw new Error("do not call SolrQuery.setFilters() abstract method");
  }

  getData() {
    this.parseQueryParams();
    this.setFilters();
    if (this.queryParams.debug) console.log(this.query);
    return this.solr.search(this.query)
      .then((response) => this.parseResponse(response));
  }

  parseResponse(response) {
    throw new Error("do not call SolrQuery.parseResponse() abstract method");
  }

}

exports.SolrQuery = SolrQuery;
