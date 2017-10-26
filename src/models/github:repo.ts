const mongoose = require('mongoose');

const gitHubRepo = new mongoose.Schema({
    item: Object,
    id: Number,
    name: String,
    description: String
});

export default mongoose.model('GitHubRepo', gitHubRepo);