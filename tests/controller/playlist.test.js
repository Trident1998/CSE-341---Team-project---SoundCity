const { getCollection } = require('../../utilities/index');
const { getAll, getSingle } = require('../../controllers/playlists');
const createError = require('http-errors');
const { ObjectId } = require('mongodb');

jest.mock('../../utilities/index');

describe('Playlist Controller', () => {
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

  describe('GET /playlists', () => {
    it('should get all playlists', async () => {
      const mockPlaylists = [
        {
          _id: new ObjectId(),
          title: 'Playlist1',
          description: 'Description1',
          user: { id: new ObjectId() },
          songs: [{ id: new ObjectId(), title: 'Song1' }]
        }
      ];

      const mockCollection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mockPlaylists)
      };

      getCollection.mockReturnValue(mockCollection);

      await getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        playlists: mockPlaylists,
        total: mockPlaylists.length
      });
    });
  });

  describe('GET /playlists/:id', () => {
    it('should get a single playlist by id', async () => {
      const mockPlaylist = {
        _id: new ObjectId(),
        title: 'Playlist1',
        description: 'Description1',
        user: { id: new ObjectId() },
        songs: [{ id: new ObjectId(), title: 'Song1' }]
      };
      req.params.id = mockPlaylist._id.toString();

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockPlaylist)
      };

      getCollection.mockReturnValue(mockCollection);

      await getSingle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPlaylist);
    });

    it('should return 404 if playlist does not exist', async () => {
      req.params.id = new ObjectId().toString();

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(null)
      };

      getCollection.mockReturnValue(mockCollection);

      await getSingle(req, res, next);

      expect(next).toHaveBeenCalledWith(createError(404, 'Playlist does not exist'));
    });
  });
});
