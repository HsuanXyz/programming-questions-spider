"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const qiita_1 = require("../models/qiita");
const mongoose = require("mongoose");
function upsertQiiTa(data) {
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
    qiita_1.default.findOneAndUpdate({ id: data.id }, data, options, (err, result) => {
        if (err) {
            throw err;
        }
    });
}
exports.default = upsertQiiTa;
//# sourceMappingURL=qiita.js.map