const { getCollection } = require('../utilities/index');
const createError = require('http-errors');
const ObjectId = require('mongodb').ObjectId;
const collectionName = 'artists';

const getAll = async (req, res) => {
  const result = getCollection(collectionName).find();
  result.toArray().then((artists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ artists: artists, total: artists.length });
  });
};

const getSingle = async (req, res, next) => {
  const artistId = new ObjectId(req.params.id);
  const result = await getCollection(collectionName).findOne({ _id: artistId });
  if (!result) {
    next(createError(404, 'Artist does not exist'));
  } else {
    res.setHeader('Content-Type', 'application/json').status(200).json(result);
  }
};

const createArtistRecord = async (req, res, next) => {
  const artistRecord = {
    name: req.body.name,
    bio: req.body.bio,
    genre: req.body.genre
  };
  const result = await getCollection(collectionName).insertOne(artistRecord);

  console.log(result);
  if (result.acknowledged) {
    console.log('Artist record was inserted with the ID', result.insertedId);
    res.status(201).json({ artistId: result.insertedId }).send();
  } else {
    next(createError(500, result.error || 'Some error occurred while creating the artist record.'));
  }
};

const updateArtistRecord = async (req, res, next) => {
  const artistId = new ObjectId(req.params.id);
  const artistRecord = {
    title: req.body.title,
    author: req.body.author,
    publishedDate: req.body.publishedDate,
    genre: req.body.genre,
    country: req.body.country
  };

  const response = await getCollection(collectionName).replaceOne({ _id: artistId }, artistRecord);

  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    next(
      createError(500, response.error || 'Some error occurred while creating the artist record.')
    );
  }
};

const deleteArtistRecord = async (req, res, next) => {
  const artistId = new ObjectId(req.params.id);

  const result = await getCollection(collectionName).deleteOne({ _id: artistId });

  console.log('result', result);
  console.log(result);
  if (result.deletedCount > 0) {
    res.status(204).send();
  } else {
    next(createError(500, result.error || 'Some error occurred while creating the artist record.'));
  }
};

module.exports = {
  getAll,
  getSingle,
  createArtistRecord,
  updateArtistRecord,
  deleteArtistRecord
};
