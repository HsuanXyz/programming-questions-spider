const mongoose = require('mongoose');

export class StackOverflow {
    source: string;
    id: string;
    link: string;
    title: string;
    excerpt: string;
    votes: string;
    answer: string ;
    time: string;
    userName: string;
    userLink: string;
    tags: string
}

const stackOverflow = new mongoose.Schema({
    source: String,
    id: String,
    link: String,
    title: String,
    excerpt: String,
    votes: String,
    answer: String ,
    time: String,
    userName: String,
    userLink: String,
    tags: String
});

export default mongoose.model('StackOverflow', stackOverflow);