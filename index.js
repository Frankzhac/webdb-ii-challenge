const express = require('express');
const helmet = require('helmet');
const db = require('./zoos/zoo-model')

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

const port = 3300;

server.get('/', (req, res) => {
  res.send('Hello Word');
});

// Endpoint starts below

server.post('/api/zoos', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      errorMessage: "Please provide a name for the animal."
    });
  }
  // add/save new zoo in the db

  db.add(
    req.body
  )
      .then(response => {
        res.status(201).json(response);
      })
      .catch(err => {
        // console.log(err);
        res.status(500).json({
          success: false,
          error: "There was an error while saving the animal to the database",
        });
      });
});


server.get('/api/zoos', (req, res) => {
  db.find()
    .then(zoos => {
      res.json({ zoos });
    })
    .catch(err => {
      // console.log(err);
      res.status(500).json({
        error: "The zoos information could not be retrieved."
      });
    });
});

server.get('/api/zoos/:id', (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(zoo => {
      if (zoo.length === 0) {
        res.status(404).json({
          message: "The zoo with the specified ID does not exist."
        });
      } else {
        res.json(zoo);
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
         error: "The zoo information could not be retrieved."
      });
    });
});

server.delete('/api/zoos/:id', (req, res) => {
  const { id } = req.params;

  db.remove(id)
    .then(response => {
      if (response === 0) {
        res.status(404).json({
          message: "The zoo with the specified ID does not exist."
        });
      } else {
        res.json({
          success: `zoo with id: ${id} removed from system`
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The zoo could not be removed"
      })
    });
});


server.put('/api/zoos/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      errorMessage: "The zoo with the specified ID does not exist."
    });
  }

  db.update(id, { name })
    .then(response => {
      if (response == 0) {
        res.status(404).json({
          errorMessage: "Please provide name and bio for the zoo."
        })
      }

      db.findById(id)
        .then(zoo => {
          if (zoo.length === 0) {
            res.status(500).json({
              error: "The zoo information could not be modified."
            })
          } else {
            res.json(zoo);
          }
        })
        .catch(err => {
          res.status(200).json({
            errorMessage: "Can't find zoo by id."
          });
        });
    })
});



server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
