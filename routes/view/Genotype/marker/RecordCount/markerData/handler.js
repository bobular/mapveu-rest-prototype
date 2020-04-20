const { FacetQuery } = require('./FacetQuery.js');

exports.route = (path, server, solr) => {
  server.get(path,
             ({ query }, res, next) => {
	       var query = new FacetQuery(solr, query);
	       query.getData().then((data) => res.send(data)).catch((err) => res.send(err.message));
	       next();
             });
};
