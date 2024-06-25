/**
 * @file TableES.js
 * @description Create an object that represents a table with key.
 * @module TableES
 * @version 1.0.0
 * @since 1.0.0
 */
/**
 * Represents a table in ESQL.
 */
export default class TableES {
    name;
    #primaryKey = 'id';
    #columns = new Set();
    #records = new Map();
    #foreignKeys = new Map();
    /**
     * Creates a new instance of the TableES class.
     * @param {string} name - The name of the table.
     */
    constructor(name) {
        this.name = typeof name === 'string' ? name.toLowerCase() : 'EMPTY';
    }

    /**
     * Adds a record to the table.
     * @param {object} data - The data object representing the record.
     * @returns {TableES} - The current instance of the TableES class.
     * @throws {TypeError} - If the data is not a non-null object.
     */
    addRecord(data) {
        if (typeof data !== "object" || Array.isArray(data)) {
            throw new TypeError("data must be an object that's not an array or null");
        } else {
            // loop over keys in data and add them to the columns
            const record = {};
            let primaryKey = undefined;
            for (let key in data) {
                const normalizedKey = key.toLowerCase();
                if (typeof data[key] !== 'object' && data[key] !== null && data[key] !== undefined) {
                    this.#columns.add(normalizedKey);
                    // if the key is like a local key, add it to the local keys
                    if (this.#isLikeLocalKey(normalizedKey)) {
                        record[this.#primaryKey] = data[key];
                        primaryKey = data[key];
                    } else {
                        record[normalizedKey] = data[key];
                    }
                }
            }
            // if the record has a primary key, check for existing record and merge new record on top of existing
            if (primaryKey !== undefined) {
                const existingRecord = this.#records.get(primaryKey);
                if (existingRecord) {
                    this.#records.set(primaryKey, { ...existingRecord, ...record });
                } else {
                    this.#records.set(primaryKey, record);
                }
            }
        }
        return this;
    }

    addForeignKey(key) {
        // check if key is a string and not empty
        if (typeof key === 'string' && key !== '') {
            return false;
        }
        // check if key in columns
        if (this.#columns.has(key.toLowerCase())) {
            //
            return true;
        }
    }

    #isLikeLocalKey(key) {
        if (typeof key !== 'string' || key === '') {
            return false;
        }
        const normalizedKey = key.toLowerCase();
        return normalizedKey === `${this.name}id` || normalizedKey === `${this.name}_id` || normalizedKey === 'id';
    }
}
