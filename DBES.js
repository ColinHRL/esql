export default class DBES {
    #tables = [];
    #failedToParse = [];

    constructor() {
        // if needed, any setup can go here. so far, no
    }

    addJSON(name, json) {
        // return true if successful, false otherwise
        // verify that it's valid json
        if (!this.#isJsonString(json)) {
            return false;
        }
        // parse the json
        let parsed = JSON.parse(json);
        // recursively add objects, and when the object is an array, add each object in the array, quit if any fail or object is null
        // if the root object is not null, add it
        if (parsed !== null) {
            return this.#addObject(name, parsed);
        }
        // else return false because nothing was added
        return false;
    }

    failedToParse() {
        // return a list of keys that failed to parse
        return this.#failedToParse;
    }

    #addObject(name, obj) {
        // return true if successful or obj is null, false otherwise
        if (obj === null) {
            return true;
        }
        // if obj is an array, recursively add each object in the array
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                this.#addObject(name, obj[i]);
            }
            return true;
        }
        // if obj is an object, loop over each key and recursively add each value, quit if any fail
        if (typeof obj === 'object') {
            for (let key in obj) {
                // if the value is an object, recursively add it. if it fails, push the obj key to failedToParse list
                if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    if (!this.#addObject(key, obj[key])) {
                        this.#failedToParse.push(key);
                    }
                }
                // if the value is an array, recursively add each object in the array. if it fails, push the obj key to failedToParse list
                else if (Array.isArray(obj[key])) {
                    for (let i = 0; i < obj[key].length; i++) {
                        if (!this.#addObject(key, obj[key][i])) {
                            this.#failedToParse.push(key);
                        }
                    }
                }
            }
            return true;
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
}