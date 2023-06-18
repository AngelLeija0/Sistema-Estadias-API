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

/* ----- Rutas para Login ----- */

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

/* ----- Rutas para Lado Administrador ----- */

// Administrador
const administradoresRouter = require('./routes/administradores');
app.use('/administradores', administradoresRouter);

// Vinculacion
const vinculadoresRouter = require('./routes/vinculacion.js');
app.use('/vinculacion', vinculadoresRouter);

// Asesores
const asesoresRouter = require('./routes/asesores');
app.use('/asesores', asesoresRouter);

// Carreras
const carrerasRouter = require('./routes/carreras');
app.use('/carreras', carrerasRouter);

// Alumnos
const alumnosRouter = require('./routes/alumnos');
app.use('/alumnos', alumnosRouter);

// Lado administrador
const adminRouter = require('./routes/lado-admin');
app.use('/admin', adminRouter);

/* ----- Ruta para Lado Vinculacion ----- */

// Lado vinculacion
const vinculacionRouter = require('./routes/lado-vinculacion');
app.use('/vinc', vinculacionRouter);

/* ----- Ruta para Lado Asesor ----- */

// Lado del asesor
const ladoAsesorRouter = require('./routes/lado-asesor');
app.use('/asesor', ladoAsesorRouter);

/* ----- Ruta para Lado Alumno ----- */

// Lado alumno
const alumnoRouter = require('./routes/lado-alumno');
app.use('/alumno', alumnoRouter);


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
