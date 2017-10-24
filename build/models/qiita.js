"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const qiiTa = new mongoose.Schema({
    source: String,
    id: String,
    link: String,
    title: String,
    like: String,
    comment: String,
    time: String,
    user: String,
    tags: String
});
exports.default = mongoose.model('QiiTa', qiiTa);
//# sourceMappingURL=qiita.js.map