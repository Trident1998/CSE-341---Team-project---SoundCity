const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Books API',
    description: 'Books API'
  },
  host: process.env.HOST,
  schemes: [process.env.SCHEME]
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./server');
});
