const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: String
});


module.exports = mongoose.model('items', itemSchema);