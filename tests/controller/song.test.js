const { getCollection } = require('../../utilities/index');
const { getAll, getSingle } = require('../../controllers/songs');
const createError = require('http-errors');
const { ObjectId } = require('mongodb');

jest.mock('../../utilities/index');

describe('Songs Controller', () => {
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

  describe('GET /songs', () => {
    it('should get all songs', async () => {
      const mockSongs = [
        {
          _id: new ObjectId(),
          title: 'Song1',
          duration: '3:50',
          genre: 'Genre1',
          artist: { id: new ObjectId(), name: 'Artist1' },
          album: { id: new ObjectId(), title: 'Album1' }
        }
      ];

      const mockCollection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mockSongs)
      };

      getCollection.mockReturnValue(mockCollection);

      await getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ songs: mockSongs, total: mockSongs.length });
    });
  });

  describe('GET /songs/:id', () => {
    it('should get a single song by id', async () => {
      const mockSong = {
        _id: new ObjectId(),
        title: 'Song1',
        duration: '3:50',
        genre: 'Genre1',
        artist: { id: new ObjectId(), name: 'Artist1' },
        album: { id: new ObjectId(), title: 'Album1' }
      };
      req.params.id = mockSong._id.toString();

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockSong)
      };

      getCollection.mockReturnValue(mockCollection);

      await getSingle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSong);
    });

    it('should return 404 if song does not exist', async () => {
      req.params.id = new ObjectId().toString();

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(null)
      };

      getCollection.mockReturnValue(mockCollection);

      await getSingle(req, res, next);

      expect(next).toHaveBeenCalledWith(createError(404, 'Song does not exist'));
    });
  });
});
