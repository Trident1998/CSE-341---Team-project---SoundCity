const { getCollection } = require('../utilities/index');
const createError = require('http-errors');
const ObjectId = require('mongodb').ObjectId;
const collectionName = 'songs';

const getAll = async (req, res) => {
  const result = getCollection(collectionName).find();
  result.toArray().then((songs) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ songs: songs, total: songs.length });
  });
};

const getSingle = async (req, res, next) => {
  const songId = new ObjectId(req.params.id);
  const result = await getCollection(collectionName).findOne({ _id: songId });
  if (!result) {
    next(createError(404, 'Songs does not exist'));
  } else {
    res.setHeader('Content-Type', 'application/json').status(200).json(result);
  }
};

const createSongsRecord = async (req, res, next) => {
  const artistRecord = {
    name: req.body.name,
    bio: req.body.bio,
    genre: req.body.genre
  };
  const result = await getCollection(collectionName).insertOne(artistRecord);

  console.log(result);
  if (result.acknowledged) {
    console.log('Songs record was inserted with the ID', result.insertedId);
    res.status(201).json({ songId: result.insertedId }).send();
  } else {
    next(createError(500, result.error || 'Some error occurred while creating the artist record.'));
  }
};

const updateSongsRecord = async (req, res, next) => {
  const songId = new ObjectId(req.params.id);
  const artistRecord = {
    name: req.body.name,
    bio: req.body.bio,
    genre: req.body.genre
  };

  const response = await getCollection(collectionName).replaceOne({ _id: songId }, artistRecord);

  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    next(
      createError(500, response.error || 'Some error occurred while updating the artist record.')
    );
  }
};

const deleteSongsRecord = async (req, res, next) => {
  const songId = new ObjectId(req.params.id);

  const result = await getCollection(collectionName).deleteOne({ _id: songId });

  console.log('result', result);
  if (result.deletedCount > 0) {
    res.status(204).send();
  } else {
    next(createError(500, result.error || 'Some error occurred while deleting the artist record.'));
  }
};

module.exports = {
  getAll,
  getSingle,
  createSongsRecord,
  updateSongsRecord,
  deleteSongsRecord
};
