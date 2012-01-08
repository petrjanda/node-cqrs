# CQRS (node.js)

Node-CQRS is implementation of command and query responsibility segregation architecture
in node.js. Its ultimate goal is to keep the solution simple, understandable and
flexible to allow adaptation to your project easy.

As the initial repository, couchdb was chosen for it simple API and architecture which
is very much in sync with event sourcing, one of the key concepts of the solution.

## Install and configure

Node-CQRS is available as npm package.

    npm install cqrs

In order to initialize your application. First you need to configure your repository.
At the moment only CouchDB implementation is available and can be initialized with:

    var repo = require('cqrs').Repository.getInstance(),
        couchdb = require('cqrs').CouchDb.getInstance();

    couchdb.database = 'cqrs';
    couchdb.options = {
      host: 'localhost',
      port: 5984
    };

    repo.strategy = couchdb;

The code above first setup couch db information and then inject it as the permanency
strategy into the repository object. In require statements you can see, that both
repo and couchdb instances were initialized using getInstance() method, which 
guarantee, there will be only one instance of those objects, as long as you keep
using it.

## CI Status

![Build Status](https://secure.travis-ci.org/petrjanda/node-cqrs.png?branch=master)