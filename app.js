const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();
const cors = require('cors');
app.use(cors());

mongoose.connect(process.env.MONGODB_URI + '/sistema-estadias-db', { useNewUrlParser: true, useUnifiedTopology: true, writeConcern: 'majority', dbName: 'sistema-estadias-db' });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Administrador
const administradoresRouter = require('./routes/administradores');
app.use('/administradores', administradoresRouter);

// Asesores
const asesoresRouter = require('./routes/asesores');
app.use('/asesores', asesoresRouter);

// Carreras
const carrerasRouter = require('./routes/carreras');
app.use('/carreras', carrerasRouter);

// Alumnos
const alumnosRouter = require('./routes/alumnos');
app.use('/alumnos', alumnosRouter);

// Estadias
const estadiasRouter = require('./routes/estadias');
app.use('/estadias', estadiasRouter);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
