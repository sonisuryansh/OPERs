const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db.js')
const userRoutes = require('./routes/user.routes.js')
const cors = require('cors');
const suriLens = require('surilens');
const captainRoutes = require('./routes/captain.routes.js');

connectToDb();

app.use(suriLens({ dashboardPort: 4445 }));
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use('/captain', captainRoutes);


app.get('/', (req, res) => {
    res.send('Hello World');
})

app.use('/user',userRoutes);

module.exports = app;