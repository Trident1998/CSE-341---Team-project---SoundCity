const { getCollection } = require('../../utilities/index');
const { getAll, getSingle } = require('../../controllers/albums');
const createError = require('http-errors');
const { ObjectId } = require('mongodb');

jest.mock('../../utilities/index');

describe('Album Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('GET /albums', () => {
    it('should get all albums', async () => {
      const mockAlbums = [
        {
          _id: new ObjectId(),
          title: 'Album1',
          release_date: '2022-01-01',
          artist: { id: new ObjectId(), name: 'Artist1' }
        }
      ];

      const mockCollection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mockAlbums)
      };

      getCollection.mockReturnValue(mockCollection);

      await getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ albums: mockAlbums, total: mockAlbums.length });
    });
  });

  describe('GET /albums/:id', () => {
    it('should get a single album by id', async () => {
      const mockAlbum = {
        _id: new ObjectId(),
        title: 'Album1',
        release_date: '2022-01-01',
        artist: { id: new ObjectId(), name: 'Artist1' }
      };
      req.params.id = mockAlbum._id.toString();

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockAlbum)
      };

      getCollection.mockReturnValue(mockCollection);

      await getSingle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAlbum);
    });

    it('should return 404 if album does not exist', async () => {
      req.params.id = new ObjectId().toString();

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(null)
      };

      getCollection.mockReturnValue(mockCollection);

      await getSingle(req, res, next);

      expect(next).toHaveBeenCalledWith(createError(404, 'Album does not exist'));
    });
  });
});
