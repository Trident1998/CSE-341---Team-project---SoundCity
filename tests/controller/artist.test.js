const { getCollection } = require('../../utilities/index');
const { getAll, getSingle } = require('../../controllers/artists');
const createError = require('http-errors');
const { ObjectId } = require('mongodb');

jest.mock('../../utilities/index');

describe('Artist Controller', () => {
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

  describe('GET /artists', () => {
    it('should get all artists', async () => {
      const mockArtists = [{ _id: new ObjectId(), name: 'Artist1', bio: 'Bio1', genre: 'Genre1' }];

      const mockCollection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mockArtists)
      };

      getCollection.mockReturnValue(mockCollection);

      await getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ artists: mockArtists, total: mockArtists.length });
    });
  });

  describe('GET /artists/:id', () => {
    it('should get a single artist by id', async () => {
      const mockArtist = { _id: new ObjectId(), name: 'Artist1', bio: 'Bio1', genre: 'Genre1' };
      req.params.id = mockArtist._id.toString();

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockArtist)
      };

      getCollection.mockReturnValue(mockCollection);

      await getSingle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockArtist);
    });

    it('should return 404 if artist does not exist', async () => {
      req.params.id = new ObjectId().toString();

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(null)
      };

      getCollection.mockReturnValue(mockCollection);

      await getSingle(req, res, next);

      expect(next).toHaveBeenCalledWith(createError(404, 'Artist does not exist'));
    });
  });
});
