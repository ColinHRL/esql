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
    #localKeys = new Set();
    #foreignKeys = new Map();
    #columns = new Set();
    #records = new Map();

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
            for (let key in data) {
                const normalizedKey = key.toLowerCase();
                if (!this.#columns.has(normalizedKey) && typeof data[key] !== 'object' && data[key] !== null && data[key] !== undefined) {
                    this.#columns.push(normalizedKey);
                    // if the key is like a local key, add it to the local keys
                    if (this.#localKeys.size === 0 && this.#isLikeLocalKey(normalizedKey)) {
                        this.#localKeys.add(normalizedKey);
                    }
                    // add the data to the record
                    record[normalizedKey] = data[key];
                }
            }
            // if the record has a local key, check for existing record and set it
            const localKey = this.#getLikeLocaLKey(record);
            if (localKey !== undefined) {
                this.#records.set(record[localKey], record);
            }
        }
        return this;
    }

    #isLikeLocalKey(key) {
        if (typeof key !== 'string' || key === '') {
            return false;
        }
        const normalizedKey = key.toLowerCase();
        return normalizedKey === `${this.name}id` || normalizedKey === `${this.name}_id` || normalizedKey === 'id';
    }

    #getLikeLocaLKey(record) {
        if (typeof record !== 'object' || key === null) {
            return undefined;
        }
        // loop over keys in record and return the first local key
        for (let key in record) {
            if (this.#isLikeLocalKey(key)) {
                return key;
            }
        }
        return undefined;
    }
}
