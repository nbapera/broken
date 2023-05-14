const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        ip: { type: String, required: true},
        created_at: { type: String, required: true},
        admin: {type: Boolean, required: true },
        verified: { type: Boolean, required: true, default: false },
        verification_token: { type: String, required: false }
    },
    { collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model