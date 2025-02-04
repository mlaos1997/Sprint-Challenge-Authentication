const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../database/usersDb');

const {authenticate, generateToken} = require('../auth/authenticate');


const register = (req, res) => {
  // implement user registration
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  
  Users
  .add(user)
  .then(saved => {
    const token = generateToken(saved);
    
    res
    .status(201)
    .json(token);
  })
  .catch(err => {
    res
    .status(500)
    .json(err);
  });
}

const login = (req, res) => {
  
  // implement user login

  let {username, password} = req.body;
  
  Users
    .findBy({username})
    .first()
    .then(user => {
    console.log(user);
    if (user && bcrypt.compareSync(password, user.password)) {
      console.log('hello again')
      const token = generateToken(user);
      res.status(200).json({message: `Welcome ${user.username}!`, authToken: token})
    } else {
      res.status(401).json({message: 'Invalid Credentials'})
    }
  })
  .catch(err => {
    res.status(500).json({ err });
  });
}

function getJokes(req, res) {
  const requestOptions = {
    headers: {
      accept: 'application/json'
    }
  };
  
  axios
  .get('https://icanhazdadjoke.com/search', requestOptions)
  .then(response => {
    res
    .status(200)
    .json(response.data.results);
  })
  .catch(err => {
    res
    .status(500)
    .json({message: 'Error Fetching Jokes', error: err});
  });
}

module.exports = server => {
    server.post('/api/register', register);
    server.post('/api/login', login);
    server.get('/api/jokes', authenticate, getJokes);
};