const mongoose = require('mongoose');

// Data ModelsSauce
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: [String],
    usersDisliked: [String],
    userId: { type: String, required: true }
});

module.exports = mongoose.model('Sauce', sauceSchema);