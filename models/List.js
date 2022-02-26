const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: String
});



const listSchema = new Schema({
    name: String,
    items: [itemSchema]
});


module.exports = mongoose.model('lists', listSchema);