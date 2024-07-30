const mongoose = require('mongoose');

function connect () {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('Connect mongodb success!');
        })
        .catch(err =>{
            console.log('Connect mongodb fail!');
            console.log(err.message);
        })
}

module.exports = { connect };