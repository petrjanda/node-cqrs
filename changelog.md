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