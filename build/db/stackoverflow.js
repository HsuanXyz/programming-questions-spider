"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stackoverflow_1 = require("../models/stackoverflow");
const mongoose = require("mongoose");
function upsertStackOverflow(data) {
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
    stackoverflow_1.default.findOneAndUpdate({ id: data.id }, data, options, (err, result) => {
        if (err) {
            throw err;
        }
    });
}
exports.default = upsertStackOverflow;
//# sourceMappingURL=stackoverflow.js.map