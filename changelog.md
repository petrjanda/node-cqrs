## v0.4.9
* create storage in view on runtime, to fix prematurely created singleton instance
* fetch views by changed string keys

## v0.4.8
* refactoring internals of couchdb utility
* refactoring couch repository and couch storage to reuse new internal implementation of couchdb utility
* dropped couchRepository.getInstance and couchStorage.getInstance
* introduced .createRepository and createStorage methods, which are the ones exported by according modules to better ensure only one instance is created.

## v0.4.7
* first piece of code migrated to nano

## v0.4.6
* view purge previous snapshot while new is taken, so it optimize database usage

## v0.4.5
* fix the view store trigger conditions, disable view store if snapshots = false properly
* fix the error response while view was loaded from the storage

## v0.4.4
* export denormalizer

## v0.4.3
* view .load() function take reload parameter, allowing to choose if snapshots should be used or the view should
 be fully reconstructed from event store

## v0.4.2
* view take snapshots by default

## v0.4.1
* added first draft of denormalizer component. Its responsibility would be to manage view updates, so its step to ofload view
 building to separate concept from view read model

## v0.3.8

* chouch repository trigger callback on storeEvent() call
* event directly applied to aggregate when emited, so current in memory instance is updated
* repository.on() now can be used to register handlers for events, which get triggered each time speicic event occurs