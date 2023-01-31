const User = require('../models/Users');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

//get all user
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();
  if (!users?.length) {
    return res.status(400).json({ message: 'No user Found' });
  }
  res.json(user);
});
//create user
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All field are required' });
  }
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate  Username' });
  }

  const hashedPwd = await bcrypt.hash(password, 10);
  const userObject = { username, password: hashedPwd, roles };
  const user = await User.create(userObject);
  if (user) {
    res.status(201).json({ message: `New user-${username} created ` });
  } else {
    res.status(201).json({ message: 'invalid user' });
  }
});

//update User
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active != 'boolean'
  ) {
    return res.status(400).json({ message: 'All field are required' });
  }
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'user not Found' });
  }
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' });
  }
  user.username = username;
  roles;
  user.roles = user.active = active;
  if (!password) {
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.user} Updated` });
});
//delete User
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'UserID Required' });
  }

  const note = await Note.findOne({ user: id }).lean.exec();

  if (note) {
    return res
      .status(400)
      .json({ message: 'User already  has notes assigned' });
  }

  const user = await user.findById(id).exec();
  if (!user) {
    return res.json(400).json({ message: 'user Not found' });
  }

  const result = await user.deleteOne();
  const reply = `username ${result.username} withID ${result._id}
  deleted`;
  res.json(reply);
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
