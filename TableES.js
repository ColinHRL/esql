/**
 * @file TableES.js
 * @description Create an object that represents a table with key.
 * @module TableES
 * @version 1.0.0
 * @since 1.0.0
 */
export default class TableES {
    #localKeys = [];
    #foreignKeys = []; // list of key names that are arrays
    #columns = [];
    #records = [];
    constructor(data) {
        if (typeof data !== "object" || data === null) {
            throw new TypeError("data must be an object");
        } else {
            if (Array.isArray(data)) {
                if (data.length > 0) {
                    if (typeof data[0] === 'object' && data[0] !== null && !Array.isArray(data[0])) {
                        // loop through the array and get the columns and set keys to number types
                        for (let i = 0; i < data.length; i++) {
                            let keys = Object.keys(data[i]);
                            for (let j = 0; j < keys.length; j++) {
                                if (typeof data[i][keys[j]] === 'number') {
                                    this.#localKeys.push(keys[j]);
                                }
                                if (this.#columns.indexOf(keys[j]) === -1) {
                                    this.#columns.push(keys[j]);
                                }
                            }
                        }
                    } else {
                        this.#localKeys.push(TableESConfig.defaultKeyAndColumnName);
                        this.#columns.push(TableESConfig.defaultKeyAndColumnName);
                        this.#records = data;
                    }
                }
            } else {
                this.#localKeys = Object.keys(data);
                this.#columns.push(data);
            }
        }
    }

    #findKey() {
        let keys = [];
        for (let i = 0; i < this.#columns.length; i++) {
            if (typeof this.#columns[i] === 'number') {
                keys.push(this.#columns[i]);
                break;
            }
        }
        if (key === '' && this.#columns.length > 0) {
            key = this.#columns[0];
        }
        return key;

    }
}

export class TableESConfig {
    defaultKeyAndColumnName = 'value';
}