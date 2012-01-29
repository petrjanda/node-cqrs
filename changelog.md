## v0.3.8

* chouch repository trigger callback on storeEvent() call
* event directly applied to aggregate when emited, so current in memory instance is updated
* repository.on() now can be used to register handlers for events, which get triggered each time speicic event occurs