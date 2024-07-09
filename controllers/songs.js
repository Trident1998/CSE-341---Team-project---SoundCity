const { getCollection } = require('../utilities/index');
const collectionName = 'songs';

const getAll = async (req, res) => {
  const result = getCollection(collectionName).find();
  result.toArray().then((songs) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ songs: songs, total: songs.length });
  });
};

module.exports = {
  getAll
};
