"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const segmentFault = new mongoose.Schema({
    source: String,
    id: String,
    link: String,
    title: String,
    votes: String,
    answer: String,
    inputTime: String,
    marks: String,
    tags: String
});
exports.default = mongoose.model('SegmentFault', segmentFault);
//# sourceMappingURL=segmentfault.js.map