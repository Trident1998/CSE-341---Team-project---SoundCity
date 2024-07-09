const { getCollection } = require('../utilities/index');
const collectionName = 'user';

const getAll = async (req, res) => {
  const result = getCollection(collectionName).find();
  result.toArray().then((users) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ users: users, total: users.length });
  });
};

module.exports = {
  getAll
};
