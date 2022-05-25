const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

// const DUMMY_USERS = [
//   {
//     id: 'u1',
//     name: 'Ankita',
//     email: 'test@test.com',
//     password: 'testers'
//   }
// ];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = User.find({}, '-password');   //return everything except password
  } catch(err) {
    const error = new HttpError(
      'Fetching users failed, try again later',
      500
    );
    return next(error);
  }
  res.json({users: (await users).map(user => user.toObject({ getters: true }))})
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
  );
}
  const { name, email, password } = req.body;

  let existingUser;
  try{
    existingUser = await User.findOne({email: email})
  } catch(err) {
    const error = new HttpError(
      'Signup failed, please try again later.',
      500
    );
    return next(error);
  }

  if(existingUser) {
    const error = new HttpError(
      'User exists already, please login instead',
      422
    );
    return next(error);
  }


  const createdUser = new User({
    name,
    email,
    image: 'https://static.standard.co.uk/2022/04/04/11/TWPITW_Still_11.jpg?width=900&auto=webp&quality=50&crop=968%3A645%2Csmart',
    password,
    places: []
  })

  try{
    await createdUser.save();
  } catch(err) {
    const error = new HttpError(
      'User signup failed, please try again later.',
      500
    );
    return next(error);
  }

  res.status(201).json({user: createdUser.toObject({ getters: true})});
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try{
    existingUser = await User.findOne({email: email})
    } catch(err) {
        const error = new HttpError(
          'User login failed, try again later.',
          500
    );
    return next(error);
  }
  
  if(!existingUser || existingUser.password !== password) {
    const error = new HttpError (
      'Invalid credentials, could not login',
      401
    );
    return next(error);
  }

  res.json({message: 'Logged in!'});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
