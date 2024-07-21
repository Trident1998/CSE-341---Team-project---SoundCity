const { getCollection } = require('../../utilities/index');
const { getAll, getSingle } = require('../../controllers/users');
const createError = require('http-errors');
const { ObjectId } = require('mongodb');

jest.mock('../../utilities/index');

describe('User Controller', () => {
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

  describe('GET /users', () => {
    it('should get all users', async () => {
      const mockUsers = [
        {
          _id: new ObjectId(),
          firstname: 'John',
          lastname: 'Doe',
          age: 25,
          email: 'john.doe@example.com',
          password: 'password',
          profile: { bio: 'bio', avatar: 'avatar' }
        },
        {
          _id: new ObjectId(),
          firstname: 'Dmytro',
          lastname: 'Ivanytskyi',
          age: 25,
          email: 'dmytro.doe@example.com',
          password: 'password',
          profile: { bio: 'bio', avatar: 'avatar' }
        }
      ];

      const mockCollection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(mockUsers)
      };

      getCollection.mockReturnValue(mockCollection);

      await getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ users: mockUsers, total: mockUsers.length });
    });
  });

  describe('GET /users/:id', () => {
    it('should get a single user by id', async () => {
      const mockUser = {
        _id: new ObjectId(),
        firstname: 'John',
        lastname: 'Doe',
        age: 25,
        email: 'john.doe@example.com',
        password: 'password',
        profile: { bio: 'bio', avatar: 'avatar' }
      };
      req.params.id = mockUser._id.toString();

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockUser)
      };

      getCollection.mockReturnValue(mockCollection);

      await getSingle(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 404 if user does not exist', async () => {
      req.params.id = new ObjectId().toString();

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(null)
      };

      getCollection.mockReturnValue(mockCollection);

      await getSingle(req, res, next);

      expect(next).toHaveBeenCalledWith(createError(404, 'User does not exist'));
    });
  });
});
