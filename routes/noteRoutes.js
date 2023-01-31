const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notesController');
router
  .route('/')
  .get(noteController.getAllNotes)
  .post(noteController.createNewNotes)
  .patch(noteController.updateNewNote)
  .delete(noteController.deleteNote);
