const express = require('express');
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require('express-validator');


// Route 1: upload a new notes using : POST '/api/notes/uploadNotes'
router.post('/uploadNotes', [
    body('title', 'title should contain minimun 3 characters').isLength({ min: 3 }),
    body('pdfURL', 'please enter a valid URL').isLength({ min: 5 }),
    body('semester', 'please enter a valid semester').isInt({ min: 1, max: 8 }),
    body('subject', 'enter a valid subject').isLength({ min: 2 })
], async (req, res) => {

    // if there is an error in validation: 
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    // uploading notes
    try {
        const { title, pdfURL, semester, subject } = req.body;

        // If notes with same title already exists
        let notes = await Note.findOne({ pdfURL: req.body.pdfURL });
        if (notes) {
            return res.status(400).send("Notes with this URL already exists");
        }
        // Saving notes to db
        const note = new Note({
            title, pdfURL, semester, subject
        });
        const saveNote = await note.save();
        if (!saveNote) {
            return res.send(400).json({ error: "Internal Server Error" });
        }
        res.json(saveNote)
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

// Route 2: Fetch all notes using: GET '/api/notes/fetchAllNotes'
router.get('/fetchAllNotes', async (req, res) => {
    try {
        const notes = await Note.find({});
        return res.json({ notes });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Router 3: Fetch all Subjects of a particular semester using GET '/api/notes/subjects'

router.get('/subjects', async (req, res) => {
    try {
        const { semester } = req.body;
        // check if semester is a valid
        if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
            return res.status(400).send("Invalid semester request");
        }
        const notes = await Note.find({ semester: semester });
        if (!notes.length) {
            return res.status(400).send("No notes of this semester is available");
        }

        // Fetch all subjects in the form of an array

        // Use Set to store unique semester-subject pairs
        const subjectsSet = new Set();
        notes.forEach(note => subjectsSet.add(JSON.stringify([semester, note.subject])));

        // Convert Set back to array and parse JSON strings
        const subjects = [...subjectsSet].map(item => JSON.parse(item));
        return res.json([...subjects]);

    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

// Route 4: Fetch all semester wise notes using: GET '/api/notes/semWiseNotes'

router.get('/semWiseNotes', async (req, res) => {
    try {
        const { semester, subject } = req.body;
        if (!semester || !subject) {
            return res.status(400).send("Invalid credentials");
        }

        const note = await Note.find({ semester, subject });
        if (!note.length) {
            return res.status(404).send("No notes of this subject/semester is available");
        }
        return res.json({ note });

    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

// Route 5: Edit notes using: PUT '/api/notes/editNotes/:id'

router.put('/editNotes/:id', async (req, res) => {
    try {
        const { title, semester, subject } = req.body;
        const newNote = {};

        if (title) { newNote.title = title; }
        if (semester) { newNote.semester = semester; }
        if (subject) { newNote.subject = subject; }

        // Find notes to update

        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        return res.json({ note });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

// Route 6: Delete Note using: Delete '/api/notes/deleteNote/:id'
router.delete('/deleteNote/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).send("Note not found");
        }

        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return res.status(500).send("Note not deleted due to some Internal Server Error");
        }
        return res.status(201).json({ Success: "Note Deletion Successful", deletedNote });
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;