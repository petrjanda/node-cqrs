# CQRS (node.js) ![Build Status](https://secure.travis-ci.org/petrjanda/node-cqrs.png?branch=master)

Node-CQRS is implementation of command and query responsibility segregation architecture
in node.js. Its ultimate goal is to keep the solution simple, understandable and
flexible to allow adaptation to your project easy.

As the initial repository, couchdb was chosen for it simple API and architecture which
is very much in sync with event sourcing, one of the key concepts of the solution.

## Install and configure

Node-CQRS is available as npm package.

    npm install cqrs

The example of complete application is available in examples/bank folder.