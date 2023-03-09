const mongoose = require('mongoose');
const {mongodb} = require('./keys');

mongoose.connect(mongodb.URI, {useNewURLParser: true})
    .then(db => console.log('Database is connected'))
    .catch(err => console.log(err))