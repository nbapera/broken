const mongoose = require('mongoose')

const CollectionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    { collection: 'collections' }
)

const model = mongoose.model('CollectionSchema', CollectionSchema)

module.exports = model