const restify = require('restify');
const walk = require('walkdir');
const SolrNode = require('solr-node');
const path = require('path');

// Solr connection
var solr = new SolrNode({
    host: 'solr-mapveu-dev.local.apidb.org',
    port: '7997',
    core: 'vb_popbio',
    protocol: 'https'
});

const server = restify.createServer();
server.use(restify.plugins.queryParser());

const paths = walk.sync('./routes');
paths.filter(jspath => /handler.js$/.test(jspath))
  .forEach(jspath => {
    const { route } = require(jspath);

    // walkdir returns full absolute paths so
    // chop of everything up to the 'routes'
    var routepath = path.dirname(jspath);
    routepath = routepath.replace(/.+?routes/, '');

    // and pass that through to the route handler setter
    route(routepath, server, solr);
  });

console.log(server.toString());
server.listen(8081);

