const crypto = require('crypto');

module.exports = {
    hashDict: [],

    /**
     * Retreives document information from the datastore
     * @param {string} id The ID of the document to search for
     * @returns document info if found, else null
     */
    findDocument: function (id) {
        //Search all entries
        for (const idx in this.hashDict) {
            const entry = this.hashDict[idx];
            //Check if this entry matches
            if (entry.id === id) {
                return entry;
            }
        }
        //If none were found, return null
        return null;
    },

    /**
     * Saves a document into the datastore
     * @param {string} hash The hash to be stored
     * @returns The generated ID of the document
     */
    saveDocument: function (hash, name) {
        //Generate a new unique ID
        let id = this.generateuid();
        //Add the document to the datastore
        this.hashDict.push({ name: name, id: id, hash: hash });
        //Return the generated ID
        return id;
    },

    /**
     * Generates a unique id for use in the datastore
     * @returns A unique ID
     */
    generateuid: function () {
        //Generate a new ID
        let id = crypto.randomBytes(16).toString('hex');
        //Check if it is in use
        while (this.findDocument(id) !== null) {
            //Generate a new ID
            id = crypto.randomBytes(16).toString('hex');
        }
        //Return the ID
        return id;
    },

    /**
     * Hashes a file
     * @param {Buffer} file The file to be hashed
     * @returns Hex representation of file hash
     */
    hashFile: function (file) {
        //Create hashing object -> Add the file to be hashed -> Get hex representation
        return crypto.createHash('sha256').update(file).digest('hex');
    }
}
