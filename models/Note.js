const mongoose = require("mongoose");
const { Schema } = mongoose;

const notesSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    pdfURL: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("notes", notesSchema);