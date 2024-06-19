# API Muncher

    Author's Note: Consuming random json isn't difficult. You can easily take some json and represent it as an ES class. The third party libraries you use likely have type definitions via typescript, but what if you don't want typescript as part of your dev environment? I don't know...I actually use typescript, but I'm in this situation where there are many devs producing different shapes of the same data, think a list of people with their respective metrics under them and then a list of metrics with people under them. I want to normalize the mostly de-normalized data and keep it locally as some sorta database to look up. I'm a fan of progressive web apps, so my approach is to use this local db to look up data I want to present, just in case I went offline.

## About

I'm using a monads and functors as the means of interacting with this library. (Think of how .filter() works for a JS Array)

## What You Can Call

I think it'll end up looking a lot like LINQ with chained monads and SQL-style functors.

* `DBES` - send your json here and it will generate `TableES` tables you can then use to look-up. Similar to SQL, I'll have a built-in table that describes the contents of the DB since things get dynamically generated from the json you pass it.
* `TableES` - The only liberty taken when trying to understand what should become a table is a JS Object with name "Metric" and JS Array with name "Metrics" will be seen as the same thing. (another check for "es" at the end of Array names for english multiples) Otherwise, tables are created based on the tables it already has, referring to JS Objects and JS Arrays.

    `Side Note: Foreign keys *might* be based on finding properties within an object with the name "id" or "{object_name}id" to build relationships between tables`

    * `.where()` - think of this like a combination between "select" and "where", and basically works like .filter() on arrays
    * `.join()` - here you can do something like `peopleTable.join(metricTable)` and it'll return a deep structure of each person containing a list of metrics. You can reverse this with `metricTable.join(peopleTable)` and you get metrics with list of people inside

## Roadmap?

This should be enough to help me consume random json from disparate sources and enough flexibility to query it for different displays. Would be nice to have a way to encrypt and save in IndexedDB, but don't want browsers to end up consuming the world locally, so maybe some LRU data hygiene? It probably could support parameter-less functions as a calculated field too, but would be trickier to scan for to make sure the contents only uses properties created within te function and sister properties and not anything hoisted or nested. I don't know. We'll see.