const { getCollection } = require('../utilities/index');
const collectionName = 'albums';

const getAll = async (req, res) => {
  const result = getCollection(collectionName).find();
  result.toArray().then((albums) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ result: albums, total: albums.length });
  });
};

module.exports = {
  getAll
};
