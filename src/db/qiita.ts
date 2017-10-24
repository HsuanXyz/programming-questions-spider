import StackOverflowDB from "../models/qiita";
import * as mongoose from "mongoose";

export default function upsertQiiTa(data) {
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
    StackOverflowDB.findOneAndUpdate({id: data.id}, data, options, (err, result) => {
        if (err) {
            throw err;
        }
    });
}