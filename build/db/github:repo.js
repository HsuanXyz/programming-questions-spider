"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const github_repo_1 = require("../models/github:repo");
const mongoose = require("mongoose");
function upsertGitHubRepo(data) {
    const DB_URL = 'mongodb://localhost/github';
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
    github_repo_1.default.findOneAndUpdate({ id: data.id }, data, options, (err, result) => {
        if (err) {
            throw err;
        }
    });
}
exports.default = upsertGitHubRepo;
//# sourceMappingURL=github:repo.js.map