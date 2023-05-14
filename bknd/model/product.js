const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        price: { type: String, required: true },
        quantity: { type: Object, required: true },
        color: { type: Array, required: true },
        sizes: { type: Array, required: true },
        _collection: { type: String, required: true },
        featured: { type: Boolean, required: true },
        url: { type: Array, required: true }
    },
    { collection: 'products' }
)

const model = mongoose.model('ProductSchema', ProductSchema)

module.exports = model