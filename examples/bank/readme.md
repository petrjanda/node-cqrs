# Bank

Bank is the very simple application, which allows you to manage multiple accounts
and their balance. There is just a few operations, which are allowed by the system:

* Open new account with specified number and owner name
* Deposit specific amount of money to the given account
* Get view, with list of accounts with their balance

## Architecture

The system is based on CQRS library, therefore separates the writes (commands)
and reads (queries). The business domain for a given application is very simple
and is focused to model the behavior described in the list above. 

The only system aggregate is Account. Its designed as object, which represent
real bank account and is identified by its number and owner id. In order to
know, how much money there is on the account, the balance information is also
part of the account state.