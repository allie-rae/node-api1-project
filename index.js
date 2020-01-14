// implement your API here
const express = require('express');
const Users = require('./data/db.js'); // Our Users database library
const server = express();

// middleware: teaches express new things
server.use(express.json()); // needed to parse JSON

// routes or endpoints

// GET to "/"
server.get('/', function (request, response) {
    response.send("<h1>Hello from Allie's Assignment!</h1>");
});

// See a list of Users -- finished 
server.get('/api/users', (req, res) => {
    Users.find() 
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The users information could not be retrieved." })
        })
})

// See a specific user -- finished 
server.get('/api/users/:id', (req, res) => {
    let id = req.params.id;
    Users.findById(id)
        .then(user => {
            !user ?
                res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
                :
                res.status(200).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The user information could not be retrieved." })
        })
})

// Create a User -- finished
server.post('/api/users', (req, res) => {
    const userData = req.body;
    const name = req.body.name;
    const bio = req.body.bio;
    !name || !bio ?
        res.status(400).json({ errorMessage: "Please provide a name and bio for the user." })
        :
        Users.insert(userData)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: "The user information could not be retrieved." })
            })
})

// Delete a User -- finished
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    Users.remove(id)
        .then(result => {
            result < 1 ?
                res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
                :
                res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: "The user could not be removed." })
        });
});

// Update a User -- finished
server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    !changes.name || !changes.bio ?
        res.status(400).json({ errorMessage: "Please provide a name and bio for the user." })
        :
        Users.update(id, changes)
            .then(count => {
                count < 1 ?
                    res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
                    :
                    Users.findById(id)
                        .then(user => {
                            res.status(200).json(user);
                        })
                        .catch(err => {
                            console.log(err)
                        })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: "The user information could not be modified." })
            });
});

const port = 8000;

server.listen(port, () => console.log(`\n ** api on port ${port} ** \n`));