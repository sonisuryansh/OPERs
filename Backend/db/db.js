const mongoose = require('mongoose');
const dns = require('dns');

// Force Google Public DNS so Windows local DNS won't block MongoDB Atlas SRV lookup
try {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
    console.error('Failed to set custom DNS servers:', e);
}

function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        console.log('Connected to DB successfully!');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });
}

module.exports = connectToDb;