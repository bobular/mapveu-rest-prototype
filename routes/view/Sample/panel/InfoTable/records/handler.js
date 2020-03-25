const { RecordQuery } = require('./RecordQuery.js');

exports.route = (path, server, solr) => {
  server.get(path,
             ({ query }, res, next) => {
	       var query = new RecordQuery(solr, query);
	       query.getData().then((data) => res.send(data)).catch((err) => res.send(err.message));
	       next();
             });
};

