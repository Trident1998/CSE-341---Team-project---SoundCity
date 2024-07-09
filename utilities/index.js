require('dotenv').config();
const mongodb = require('../db/connect');

const Util = {};

Util.handleErrors = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

Util.getCollection = (collectionName) => {
  return mongodb.getDb().collection(collectionName);
};

module.exports = Util;
