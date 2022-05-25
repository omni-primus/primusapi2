const express = require('express');
const app = express();
const morgan = require('morgan');
const leagueRoutes = require('./routes/league');

const port = 8080;

app.listen(port, "0.0.0.0");

//Routes
app.get('/', (req, res) => {
    res.send('Success');
});

app.use('/league', leagueRoutes);
