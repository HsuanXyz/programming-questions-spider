"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const gitHubRepo = new mongoose.Schema({
    item: Object,
    id: Number,
    name: String,
    description: String
});
exports.default = mongoose.model('GitHubRepo', gitHubRepo);
//# sourceMappingURL=github:repo.js.map