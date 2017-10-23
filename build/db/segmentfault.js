"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const segmentfault_1 = require("../models/segmentfault");
const mongoose = require("mongoose");
function upsertSegmentFault(data) {
    const DB_URL = 'mongodb://localhost/questions';
    if (mongoose.connection.readyState === 0) {
        mongoose.connect(DB_URL, {
            useMongoClient: true,
        });
    }
    const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
    };
    segmentfault_1.default.findOneAndUpdate({ id: data.id }, data, options, (err, result) => {
        if (err) {
            throw err;
        }
    });
}
exports.default = upsertSegmentFault;
//# sourceMappingURL=segmentfault.js.map