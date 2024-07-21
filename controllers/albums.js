const { getCollection } = require('../utilities/index');
const createError = require('http-errors');
const ObjectId = require('mongodb').ObjectId;
const collectionName = 'albums';

const getAll = async (req, res) => {
  const result = getCollection(collectionName).find();
  result.toArray().then((albums) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ albums: albums, total: albums.length });
  });
};

const getSingle = async (req, res, next) => {
  const albumId = new ObjectId(req.params.id);
  const result = await getCollection(collectionName).findOne({ _id: albumId });
  if (!result) {
    next(createError(404, 'Album does not exist'));
  } else {
    res.setHeader('Content-Type', 'application/json').status(200).json(result);
  }
};

const createAlbumRecord = async (req, res, next) => {
  const artistRecord = {
    title: req.body.title,
    release_date: req.body.release_date,
    artist: {
      id: req.body.id,
      name: req.body.name
    }
  };
  const result = await getCollection(collectionName).insertOne(artistRecord);

  console.log(result);
  if (result.acknowledged) {
    console.log('Album record was inserted with the ID', result.insertedId);
    res.status(201).json({ albumId: result.insertedId }).send();
  } else {
    next(createError(500, result.error || 'Some error occurred while creating the artist record.'));
  }
};

const updateAlbumRecord = async (req, res, next) => {
  const albumId = new ObjectId(req.params.id);
  const artistRecord = {
    title: req.body.title,
    release_date: req.body.release_date,
    artist: {
      id: req.body.id,
      name: req.body.name
    }
  };

  const response = await getCollection(collectionName).replaceOne({ _id: albumId }, artistRecord);

  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    next(
      createError(500, response.error || 'Some error occurred while updating the artist record.')
    );
  }
};

const deleteAlbumRecord = async (req, res, next) => {
  const albumId = new ObjectId(req.params.id);

  const result = await getCollection(collectionName).deleteOne({ _id: albumId });

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
  createAlbumRecord,
  updateAlbumRecord,
  deleteAlbumRecord
};
