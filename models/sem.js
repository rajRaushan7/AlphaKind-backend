const mongoose = require("mongoose");
const { Schema } = mongoose;

const semesterSchema = new Schema({
    semester: {
        type: Number,
        required: true
    },
    subject: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('semesters', semesterSchema);