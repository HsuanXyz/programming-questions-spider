const mongoose = require('mongoose');

const qiiTa = new mongoose.Schema({
    source: String,
    id: String,
    link: String,
    title: String,
    like: String,
    comment: String ,
    time: String,
    user: String,
    tags: String
});

export default mongoose.model('QiiTa', qiiTa);