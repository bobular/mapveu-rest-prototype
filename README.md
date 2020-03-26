# A guide to the code architecture

This is a prototype proposal for a new REST data API layer
between the popbio map (MapVEu) and the back end (currently Solr).

To run the server for testing:

```bash
# tunnel to Solr if required
ssh -f -N -L 7997:solr-mapveu-dev.local.apidb.org:8443 ash
# first time install if required
npm install
# run server
node server.js
```

This implementation is obviously tied to Solr but the idea is that
once the API is documented, other implementations can be written for
other back end data stores.

Note that field names used in URL parameters
* query : for passing the user's search box query to back end
* geoField, catField : for faceting
* fields : for specifying which fields should be returned in regular records (e.g. InfoTable/records)
will be configured in the front end code. I don't think there's a need for the data API to know about them?
Although if we want to check the validity of these params, the data API will need to know about them.

## Path of each handler.js files within ./routes is the REST endpoint

The walkdir() call in server.js looks for handler.js files and adds
them to the server's router using their filesystem path as the endpoint
path (actually just the part between 'routes/' and '/handler.js').

## Object-oriented design

In each handler.js currently either a `FacetQuery` or `RecordQuery`
object is instantiated and its `getData()` method called.

The source for these classes is in the directory tree that the handler.js file is located in.

Let's use this example `/view/Sample/markers/SampleCount/markerData`

You can test it with

```
curl "http://localhost:8080/view/Sample/marker/SampleCount/markerData?query=geolocations_cvterms:England&geoField=geohash_2&catField=species_category&debug=1" | jq .
```

The `FacetQuery` in that directory extends `ViewQuery` located in `../../../ViewQuery.js`,
which is also `routes/view/Sample/ViewQuery.js`.

That `ViewQuery` extends `SolrQuery` located in `../SolrQuery.js` aka `routes/view/SolrQuery.js`.

The idea here is tha `SolrQuery` is the base class used by all views and all types of handlers.

As you go into child directories, you inherit more specialised
functionality.  So in `routes/view/Sample/ViewQuery.js` a
`setFilters()` function is defined which sets the Solr `fq`
parameter(s) for every Solr query made by handlers in that directory
tree.  Compare this with the repeated cut-and-paste definition of fq
filters in the old Solr config (configoverlay.json and solrconfig.xml)
for each requestHandler in the same view (e.g. SmplGeoclust SmplPalette
SmplTable and more).

The names of the classes can be the same in different directory
subtrees. There are two `FacetQuery` classes: a Sample-flavoured one
and a Genotype-flavoured one.  They never need to know about each
other so can have the same name.  It means it's easier to make the
handlers for a whole new view (no need to change all the class names,
e.g. to SampleViewQuery and SampleFacetQuery).

The main methods to look at are the constructors and getData().

(But there's still some unwanted duplication that needs addressing.  See mixins section below.)

## Testing the other three endpoints

```
# data for genotype pie markers filtered for Allele:Kdr L1014 and categorising on Allele
curl "http://localhost:8080/view/Genotype/marker/AlleleCount/markerData?query=locus_name_s:%22Kdr%20L1014%22&geoField=geohash_2&catField=genotype_name_s" | jq .

# info table data for genotype assays
curl "http://localhost:8080/view/Genotype/panel/InfoTable/records?query=species_category:%22Anopheles%20albimanus%22&fields=id,accession,geolocations" | jq .

# info table data for samples
curl "http://localhost:8080/view/Sample/panel/InfoTable/records?query=species_category:%22Anopheles%20albimanus%22&fields=id,accession,geolocations" | jq .
```

## No complex Solr configuration, or proxy, needed

All the filters, facet statistics etc are configured in the data API
implementation, so no need to set up query handlers in
configoverlay.json and solrconfig.xml

There shouldn't be any need for the security proxy either.

If we can build the streaming CSV exporter into the restify server,
that would be good, but there are some things to consider

* currently all the exportable fields are copyField'ed to ext_blah
  versions - IIRC to enable docValues which makes the super efficient
  streaming possible. Maybe it's just easier to have docValues=true on
  all fields?  maybe have a noExport flag in the client config for
  fields that can't have docValues (are there any?)

## A need for mixins?

If you take a look at both `RecordQuery` classes,

```
./routes/view/Genotype/panel/InfoTable/records/RecordQuery.js
./routes/view/Sample/panel/InfoTable/records/RecordQuery.js
```

you'll see that they are identical.  However, they inherit from
different `ViewQuery` parent classes, so the class does behave
differently.

One solution I think is to use mixins, to bring the
`parseQueryParams()` and `parseQueryParams()` methods in from
some other class.

Another place where this is needed is in `FacetQuery`.
All PointMarkers (e.g. circular pie markers) in the client
require bounding box and average lat/long statistics
to be calculated by the back end.

At the moment, in both `FacetQuery.js` files these facet
statistics are injected by calling a static method on PointMarker
which lives outside the `./routes' directory.  It's imported
with a ridiculously long ../../../../....

```
  const { PointMarker } = require('../../../../../../lib/Marker/PointMarker.js');

  ...

  const commonGeoFacetStats = PointMarker.commonGeoFacetStats();
```

## user query handling not yet done in back-end agnostic fashion

The user queries are what the user enters in the search bar (or clicks
on legend categories).  For example "Anopheles gambiae in Species" in
the old client gets sent to Solr as `species_category:"Anopheles
gambiae"`.  There's also various logic (and, or and not) that combines
them.

In this prototype, they are passed straight through. The client would
need to construct Solr syntax queries.  This is not ideal.  We don't
want to be married to Solr!

So, can we find a reasonably mature and widely accepted "text query
syntax"?  If it was in JSON format, a query for "Anopheles gambiae in
Species" AND "pool in Sample type" might look something like this.

```
{
  AND: [
    {
      field: 'species_category',
      query: 'Anopheles gambiae',
      phrase: true
    },
    {
      field: 'sample_type',
      query: 'pool'
    }
  ]
}
```

It would be great if it could handle numeric queries as well, e.g.

```
{
  field: 'sample_size_i',
  gt: 10
}
```

But also handle ranges, dates etc.

Is there something like this?  Should we make something if there isn't?




