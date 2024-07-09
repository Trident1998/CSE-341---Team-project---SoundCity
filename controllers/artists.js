const { getCollection } = require('../utilities/index');
const collectionName = 'artists';

const getAll = async (req, res) => {
  const result = getCollection(collectionName).find();
  result.toArray().then((artists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ artists: artists, total: artists.length });
  });
};

module.exports = {
  getAll
};
