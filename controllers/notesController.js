const Note = require('../models/Note');
const User = require('../models/Users');
const asyncHandler = require('express-async-handler');

const getAllNotes = asyncHandler(async (req, res) => {
  //Get All notes from Mongo DB
  const notes = await Note.find().lean();

  if (!notes?.length) {
    return res.status(400).json({ message: 'No notes found' });
  }

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await user.findById(note.user).lean().exec();
      return { ...note, username: user.name };
    })
  );
  res.json(notesWithUser);
});
const createNewNotes = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;
  if (!user || !title || !text) {
    res.status(409).json({ message: 'Duplicate Note Title' });
  }
  const note = await Note.create({ user, title, text });
  if (note) {
    return res.status(201).json({ message: 'New Note Created' });
  } else {
    return res.status(400).json({ message: 'Invalid Data ' });
  }
});
const updateNewNote = asyncHandler(async (req, res) => {
  const { id, user, title, text, completed } = req.body;
  if (!id || !user || !title || !text || typeof completed !== completed) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const note = await Note.findBy(id).exec();
  if (!note) {
    return res.json({ message: 'No note found' });
  }

  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate && duplicate_.id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate Note' });
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updateNote = await note.save();
  res.json(`${updateNote} Updated`);
});
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'NOTE ID REQUIRED' });
  }
  const note = await Note.findById(id).exec();
  if (!note) {
    return res.status(400).json({ message: 'Note not found' });
  }
  const result = await note.deleteOne();
  const reply = `Note ${result.title} wit id  ${id} deleted`;
});

module.exports = { getAllNotes, createNewNotes, updateNewNote, deleteNote };
