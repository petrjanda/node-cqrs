var CouchDb = require('../lib/couchdb');

var couchdb = new CouchDb('cqrs');

couchdb.setup();

// couchdb.storeEvent(1, 'account:opened', {
//  number: '35-4395980207/0100'
// });

// couchdb.storeEvent(2, 'account:opened', {
//  number: '10-9800003471/0100'
// });

// function doTransaction(amount) {
//   couchdb.storeEvent(1, 'account:outgoingPaymentProcessed', {
//     amount: amount,
//     account: '10-9800003471/0100'
//   })

//   couchdb.storeEvent(2, 'account:incomingPaymentProcessed', {
//     amount: amount,
//     account: '35-4395980207/0100'
//   }) 
// }

// console.log("WRITE:");
// var start = new Date().getTime();

// for(var i = 0; i < 10; i++)
// {
//   doTransaction(Math.random()*1000);
// }

// var loaded = new Date().getTime();
// console.log(loaded - start + ' ms');

// console.log("READ:");

// var start = new Date().getTime();
// couchdb.getEventsByAggregate(1, function(docs) {
//   var loaded = new Date().getTime();
//   console.log(loaded - start + ' ms');

//   JSON.parse(docs);

//   var parsed = new Date().getTime();
//   console.log(parsed - loaded + ' ms');
// })