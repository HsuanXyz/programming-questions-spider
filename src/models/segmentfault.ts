const mongoose = require('mongoose');

const segmentFault = new mongoose.Schema({
    source: String,
    id: String,
    link: String,
    title: String,
    votes: String,
    answer: String ,
    inputTime: String,
    marks: String,
    tags: String
});

export default mongoose.model('SegmentFault', segmentFault);