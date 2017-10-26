import GitHubRepoDB from "../models/github:repo";
import * as mongoose from "mongoose";

export default function upsertGitHubRepo(data) {
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
    GitHubRepoDB.findOneAndUpdate({id: data.id}, data, options, (err, result) => {
        if (err) {
            throw err;
        }
    });
}