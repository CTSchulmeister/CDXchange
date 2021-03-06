// --- MODULES ---
const db = require('../db');
const mongoose = require('mongoose');

// --- MODEL ---
const ItemSchema = new mongoose.Schema({
    // ItemCode.
    _id: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    recordLabel: String,
    catalogCategory: {
        type: String,
        required: true
    },
    description: String,
    rating: {
        value: {
            type: Number,
            min: 1,
            max: 5
        },
        actualValue: {
            type: Number,
            min: 1,
            max: 5
        },
        numberOfVotes: {
            type: Number,
            min: 1
        }
    },
    tracks: Array
}, {
    toObject: {
        virtuals: true
    },
    toJson: {
        virtuals: true
    }
});

const Item = db.model('Item', ItemSchema);

// --- MODULE EXPORTS ---

module.exports.Items = Item;

/**
 * getItem(itemId) - Returns an item document that matches the passed id.
 * @param itemId
 * @returns {Promise<any>}
 */
module.exports.getItem = function(itemId) {
    return new Promise((resolve, reject) => {
        Item.findOne({ _id: itemId })
            .then(doc => resolve(doc))
            .catch(err => reject(err))
    });
}

/**
 * getItemsByCategory(category) - Returns an array of all items with a catalogCategory value
 *      equal to that of the passed category.
 * @param category - The catalog category to filter by.
 * @returns {Promise<any>}
 */
module.exports.getItemsByCategory = function(category) {
    return new Promise((resolve, reject) => {
        Item.find({ catalogCategory: category })
            .then(docs => resolve(docs))
            .catch(err => reject(err))
    })
}

/**
 * getItemsByArtist(artist) - Returns an array of all CDs by the passed artist.
 * @param {String} artist - The artist to filter by.
 * @returns {Promise<any>}
 */
module.exports.getItemsByArtist = function(artist) {
    return new Promise((resolve, reject) => {
        Item.find({ artist: artist })
            .then(docs => resolve(docs))
            .catch(err => reject(err))
    })
}

/**
 * getItems(arrayOfItemIds) - Returns all of the items in an array of item ids.
 * @param {Array<String>} arrayOfItemIds - An array of item ids.
 * @returns {Promise<any>}
 */
module.exports.getItems = function(arrayOfItemIds) {
    return new Promise((resolve, reject) => {
        Item.find({ _id: { $in: arrayOfItemIds } })
            .then(docs => resolve(docs))
            .catch(err => reject(err))
    })
}

/**
 * getItemsNotInArray(arrayOfItemIds) - Returns all of the items not in a given array of ids.
 * @param {Array<String>} arrayOfItemIds - An array of item ids owned by the user.
 * @returns {Promise<any>}
 */
module.exports.getItemsNotInArray = function(arrayOfItemIds) {
    return new Promise((resolve, reject) => {
        Item.find({ _id: { $nin: arrayOfItemIds } })
            .then(docs => resolve(docs))
            .catch(err => reject(err))
    })
}

/**
 * getItemsNotOwnedByCategory(arrayOfItemIds, category) - Returns all of the items not in an array
 *      of owned items per category.
 * @param arrayOfItemIds - An array of item ids owned by the user.
 * @param category - The category to look through.
 * @returns {Promise<any>}
 */
module.exports.getItemsNotOwnedByCategory = function(arrayOfItemIds, category) {
    return new Promise((resolve, reject) => {
        Item.find( { _id: { $nin: arrayOfItemIds}, catalogCategory: category })
            .then(docs => resolve(docs))
            .catch(err => reject(err))
    })
}

/**
 * addItem(itemName, artist, year, recordLabel, catalogCategory, description, rating, tracks) -
 *      Adds an item document with the passed attributes to the items collection.
 * @param itemName - The album's name.
 * @param artist - The album's main artist.
 * @param year - The release year of the album.
 * @param recordLabel - The principle recording label the album was released under.
 * @param catalogCategory - The genre the album falls under (refer to available genres).
 * @param description - The album's description
 * @param rating - The album's star rating (1-5).
 * @param tracks - An array of track documents.
 * @returns {Promise<any>} 
 */
module.exports.addItem = function(itemName, artist, year, recordLabel, catalogCategory, description, rating, tracks) {
    return new Promise((resolve, reject) => {
        let newItem = new Item({
            _id: artist + '-' + itemName,
            itemName: itemName,
            artist: artist,
            year: year,
            recordLabel: recordLabel,
            catalogCategory: catalogCategory,
            description: description,
            rating: {
                value: rating,
                actualValue: rating,
                numberOfVotes: 1
            },
            tracks: tracks
        });

        newItem.save()
            .then(doc => resolve(doc))
            .catch(err => reject(err))
    });
}

/**
 * updateItem(itemId, update) - Finds the item match the item id and updates it, returning
 *      the new document if no errors occur.
 * @param {String} itemId - The _id value for the item to be found.
 * @param {Object} update - An object representing the update to be done.
 * @returns {Promise<any>}
 */
module.exports.updateItem = function(itemId, update) {
    return new Promise((resolve, reject) => {
        Item.findOneAndUpdate({ _id: itemId }, update, { new: true })
            .then(doc => resolve(doc))
            .catch(err => reject(err))
    })
}

/**
 * deleteItem(itemId) - Deletes the item from the database.
 *      Returns the deleted item.
 * @param {String} itemId - The _id value for the item to be deleted.
 * @returns {Promise<any>}
 */
module.exports.deleteItem = function(itemId) {
    return new Promise((resolve, reject) => {
        Item.findOneAndDelete({ _id: itemId })
            .then(doc => resolve(doc))
            .catch(err => reject(err))
    })
}

/**
 * doesItemExist(itemId) - Returns true if item is a valid item in the database.
 * @param {String} itemId - The _id value of the item to be checked for.
 * @returns {Promise<any>}
 */
module.exports.doesItemExist = function(itemId) {
    return new Promise((resolve, reject) => {
        Item.findOne({ _id: itemId })
            .then(doc => {
                if(doc != null) {
                    resolve(true);
                } else {
                    reject(false);
                }
            })
            .catch(err => reject(err))
    })
}