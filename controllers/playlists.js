const { getCollection } = require('../utilities/index');
const createError = require('http-errors');
const ObjectId = require('mongodb').ObjectId;
const collectionName = 'playlists';

const getAll = async (req, res) => {
  const result = getCollection(collectionName).find();
  result.toArray().then((playlists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ playlists: playlists, total: playlists.length });
  });
};

const getSingle = async (req, res, next) => {
  const playlistId = new ObjectId(req.params.id);
  const result = await getCollection(collectionName).findOne({ _id: playlistId });
  if (!result) {
    next(createError(404, 'Playlist does not exist'));
  } else {
    res.setHeader('Content-Type', 'application/json').status(200).json(result);
  }
};

const createPlaylistRecord = async (req, res, next) => {
  const playlistRecord = {
    title: req.body.title,
    description: req.body.description,
    user: {
      id: req.body.user_id
    },
    songs: req.body.songs.map((song) => ({
      id: song.id,
      title: song.title
    }))
  };

  const result = await getCollection(collectionName).insertOne(playlistRecord);

  console.log(result);
  if (result.acknowledged) {
    console.log('Playlist record was inserted with the ID', result.insertedId);
    res.status(201).json({ playlistId: result.insertedId }).send();
  } else {
    next(
      createError(500, result.error || 'Some error occurred while creating the playlist record.')
    );
  }
};

const updatePlaylistRecord = async (req, res, next) => {
  const playlistId = new ObjectId(req.params.id);
  const playlistRecord = {
    title: req.body.title,
    duration: req.body.duration,
    genre: req.body.genre,
    playlist: {
      id: req.body.playlist_id,
      name: req.body.playlist_name
    },
    album: {
      id: req.body.album_id,
      title: req.body.album_name
    }
  };

  const response = await getCollection(collectionName).replaceOne(
    { _id: playlistId },
    playlistRecord
  );

  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    next(
      createError(500, response.error || 'Some error occurred while updating the playlist record.')
    );
  }
};

const deletePlaylistRecord = async (req, res, next) => {
  const playlistId = new ObjectId(req.params.id);

  const result = await getCollection(collectionName).deleteOne({ _id: playlistId });

  console.log('result', result);
  if (result.deletedCount > 0) {
    res.status(204).send();
  } else {
    next(
      createError(500, result.error || 'Some error occurred while deleting the playlist record.')
    );
  }
};

module.exports = {
  getAll,
  getSingle,
  createPlaylistRecord,
  updatePlaylistRecord,
  deletePlaylistRecord
};
