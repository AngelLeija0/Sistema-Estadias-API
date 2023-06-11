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

/* ----- Rutas back-end o para pruebas ----- */

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


/* ----- Rutas front-end ----- */

// Lado del asesor
const ladoAsesorRouter = require('./routes/lado-asesor');
app.use('/asesor', ladoAsesorRouter);

// Lado alumno
const alumnoRouter = require('./routes/lado-alumno');
app.use('/alumno', alumnoRouter);

// Lado administrador
const adminRouter = require('./routes/lado-admin');
app.use('/admin', adminRouter);


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
