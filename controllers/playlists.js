const { getCollection } = require('../utilities/index');
const collectionName = 'playlists';

const getAll = async (req, res) => {
  const result = getCollection(collectionName).find();
  result.toArray().then((playlists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ playlists: playlists, total: playlists.length });
  });
};

module.exports = {
  getAll
};
