const express = require('express');

const postsRouter = require('./data/data-router.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {

});


server.use('/api/posts', postsRouter);

server.listen(4000, () => {
    console.log('\n*** Server Running on http://localhost:4000 ***\n');
  });