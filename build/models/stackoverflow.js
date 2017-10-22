"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
class StackOverflow {
}
exports.StackOverflow = StackOverflow;
const stackOverflow = new mongoose.Schema({
    source: String,
    id: String,
    link: String,
    title: String,
    excerpt: String,
    votes: String,
    answer: String,
    time: String,
    userName: String,
    userLink: String,
    tags: String
});
exports.default = mongoose.model('StackOverflow', stackOverflow);
//# sourceMappingURL=stackoverflow.js.map