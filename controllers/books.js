const mongodb = require('../db/connect');
const createError = require('http-errors');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
  const result = await mongodb.getDb().db().collection('books').find();
  result.toArray().then((books) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ result: books, total: books.length });
  });
};

const getSingle = async (req, res, next) => {
  const bookId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('books').findOne({ _id: bookId });
  if (!result) {
    next(createError(404, 'Book does not exist'));
  } else {
    res.setHeader('Content-Type', 'application/json').status(200).json(result);
  }
};

const createBookRecord = async (req, res, next) => {
  const bookRecord = {
    title: req.body.title,
    author: req.body.author,
    publishedDate: req.body.publishedDate,
    genre: req.body.genre,
    country: req.body.country
  };

  const result = await mongodb.getDb().db().collection('books').insertOne(bookRecord);

  console.log(result);
  if (result.acknowledged) {
    console.log('Book was inserted with the ID', result.insertedId);
    res.status(201).json({ bookId: result.insertedId }).send();
  } else {
    next(createError(500, result.error || 'Some error occurred while creating the book record.'));
  }
};

const updateBookRecord = async (req, res, next) => {
  const bookId = new ObjectId(req.params.id);
  const bookRecord = {
    title: req.body.title,
    author: req.body.author,
    publishedDate: req.body.publishedDate,
    genre: req.body.genre,
    country: req.body.country
  };

  const response = await mongodb
    .getDb()
    .db()
    .collection('books')
    .replaceOne({ _id: bookId }, bookRecord);

  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    next(createError(500, response.error || 'Some error occurred while creating the book record.'));
  }
};

const deleteBookRecord = async (req, res, next) => {
  const bookId = new ObjectId(req.params.id);

  const result = await mongodb.getDb().db().collection('books').deleteOne({ _id: bookId });

  console.log('result', result);
  console.log(result);
  if (result.deletedCount > 0) {
    res.status(204).send();
  } else {
    next(createError(500, result.error || 'Some error occurred while creating the book record.'));
  }
};

module.exports = {
  getAll,
  getSingle,
  createBookRecord,
  updateBookRecord,
  deleteBookRecord
};
