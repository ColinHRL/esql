export default class DBES {
    #tables = new Map();
    #keys = new Set();
    #failedToParse = [];

    constructor() {
        // create a table to hold the list of tables
        this.#tables.set('tables', new TableES('tables'));
    }

    addJSON(name, json) {
        // return true if successful
        // verify that it's valid json and the name is a string and not empty
        if (!this.#isJsonString(json) || typeof name !== 'string' || name === '') {
            return false;
        }
        // parse the json
        let parsed = JSON.parse(json);
        // if the root object is not null, add it
        if (parsed !== null && typeof parsed === 'object') {
            const success = this.#addObject(name, parsed);
            if (success) {
                this.#buildForeignKeys();
                return true;
            }
        }
        // else return false because nothing was added
        return false;
    }

    failedToParse() {
        // return a list of keys that failed to parse
        return this.#failedToParse;
    }

    #addObject(name, obj) {
        try {
            // return true if successful or obj is null
            if (obj === null) {
                return true;
            }
            // if obj is an array, recursively add each object in the array
            if (Array.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    if (typeof obj[i] === 'object') {
                        this.#addObject(name, obj[i]);
                    }
                }
                return true;
            }
            // if obj is an object, loop over each key and recursively add each value
            else if (typeof obj === 'object') {
                let tableHasValues = false;
                for (let key in obj) {
                    // if the value is an array, recursively add each object in the array
                    if (Array.isArray(obj[key])) {
                        for (let i = 0; i < obj[key].length; i++) {
                            if (typeof obj[key][i] === 'object') {
                                this.#addObject(key, obj[key][i]);
                            }
                        }
                    }
                    // if the value is an object, recursively add it
                    else if (typeof obj[key] === 'object') {
                        // consider this a foreign key relationship
                        this.#addObject(key, obj[key]);
                    }
                    // if the key's value is a string, number, or boolean, flag the object as having values
                    else if (!tableHasValues && typeof obj[key] === 'string' || typeof obj[key] === 'number' || typeof obj[key] === 'boolean') {
                        tableHasValues = true;
                    }
                }
                // if the table has values, add the object as a record
                if (tableHasValues) {
                    this.#tables.get('tables')?.addRecord({ tablesid: name });
                    // if table doesn't exist, create it
                    if (!this.#tables.has(name)) {
                        this.#tables.set(name, new TableES(name));
                    }
                    this.#tables.get(name)?.addRecord(obj);
                }
                return true;
            }
        } catch (e) {
            this.#failedToParse.push(name);
            return false;
        }
    }

    #isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    #buildForeignKeys() {
        // loop over each table
        for (let table of this.#tables.values()) {
            // see if the table name is a foreign key in another table by likness
            for (let table2 of this.#tables.values()) {
                if (table.name !== table2.name) {
                    for (let key of table2.columns) {
                        if (this.#likeForeignKey(table.name, key)) {
                            table.addForeignKey(table2.name);
                        }
                    }
                }
            }
        }
    }

    #likeForeignKey(tableName, key) {
        // key will be {like table name}id or {like table name}_id, and table name could be pluralized, so we match as best we can with the table name
        if (typeof key !== 'string' || key === '' || typeof tableName !== 'string' || tableName === '') {
            return false;
        }
        const like = key.toLowerCase();
        const table = tableName.toLowerCase();
        let forgeinKeyFound = false;
        if (table.length >= 1 && (like === `${table}id` || like === `${table}_id`)) {
            forgeinKeyFound = true;
        }
        if (!forgeinKeyFound && table.length > 1 && (like === `${table.substring(0, table.length - 1)}id` || like === `${table.substring(0, table.length - 1)}_id`)) {
            forgeinKeyFound = true;

        }
        if (!forgeinKeyFound && table.length > 2 && (like === `${table.substring(0, table.length - 2)}id` || like === `${table.substring(0, table.length - 2)}_id`)) {
            forgeinKeyFound = true;
        }
        return forgeinKeyFound;
    }
}