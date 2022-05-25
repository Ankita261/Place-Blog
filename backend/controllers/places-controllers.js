const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const getCoordsForAddress = require('../util/location');
const HttpError = require('../models/http-error');
const Place = require('../models/place');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');

// let DUMMY_PLACES = [
//   {
//     id: 'p1',
//     title: 'Empire State Building',
//     description: 'One of the most famous sky scrapers in the world!',
//     location: {
//       lat: 40.7484474,
//       lng: -73.9871516
//     },
//     address: '20 W 34th St, New York, NY 10001',
//     creator: 'u1'
//   }
// ];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // { pid: 'p1' }
  
  let place;
  
  try{
    place = await Place.findById(placeId);
  }catch(err){
    const error = new HttpError(
      'Something went wrong, could not find place!',
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.', 
      404
    );
    return next(error);
  }

  res.json({ place: place.toObject( {getters: true}) }); // => { place } => { place: place }
};

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  
  
  let userWithPlaces;
  try{
    userWithPlaces = await User.findById(userId).populate('places');
  }
  // let places;
  // try{
  //   places = await Place.find({creator: userId});
  catch(err){
    const error = new HttpError(
      'Could not fetch places for selected user',
      500
    );
    return next(error)
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {   //(!places || places.length === 0)
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }

  //res.json({ places: places.map( place => place.toObject({ getters: true })) });
  res.json({ places: userWithPlaces.places.map( place => place.toObject({ getters: true })) });
};


//if you use google api to validate coordinates

// const createPlace = async(req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return next (new HttpError('Invalid inputs passed, please check your data.', 422));
//   }

//   const { title, description, address, creator } = req.body;
// let coordinates;
// try{
//   coordinates = await getCoordsForAddress(address);
// } catch (error) {
//   return next(error);
// }

//   // const title = req.body.title;
//   const createdPlace = {
//     id: uuid(),
//     title,
//     description,
//     location: coordinates,
//     address,
//     creator
//   };

//   DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)

//   res.status(201).json({ place: createdPlace });
// };

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, description, address, creator } = req.body;

  const coordinates = getCoordsForAddress(address);

  // const title = req.body.title;
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:'https://media.istockphoto.com/photos/new-york-city-skyline-picture-id486334510?k=20&m=486334510&s=612x612&w=0&h=OsShL4aTYo7udJodSNXoU_3anIdIG57WyIGuwW2_tvA=',
    creator
  });

  let user;
  try{
    user = await User.findById(creator);
  } catch(err) {
    const error = new HttpError(
      'Creating plae failed, please try again',
      500
    );
    return next(error);
  }

  if(!user){
    const error = new HttpError(
      'Could not find user for given id',
      404
    );
    return next(error);
  }

  console.log(user);

  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({session: sess});
    await sess.commitTransaction();
  } 
  catch(err) {
    const error = new HttpError(
      'Creating place failed, please try again!',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try{
    place = await Place.findById(placeId);
  } catch(err) {
    const error = new HttpError(
      'Something went wrong, could not update place',
      500
    );
    return next(error);
  }
  
  place.title = title;
  place.description = description;

  try{
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({getters: true}) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try{
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place',
      500
    );
    return next (error);
  }

  if(!place){
    const error = new HttpError(
      'Could not find place for this id',
      404
    );
    return next(error);
  }
  
  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    place.remove({session: sess});
    place.creator.places.pull(place);
    await place.creator.save({session: sess});
    await sess.commitTransaction();
  }
   catch(err) {
    const error = new HttpError (
      'Something went wrong, could not delete place',
      500
    );
    return next(error)
  }
  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
