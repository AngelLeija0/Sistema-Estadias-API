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

// Avances
const avancesRouter = require('./routes/avances');
app.use('/avances', avancesRouter);

// Carreras
const carrerasRouter = require('./routes/carreras');
app.use('/carreras', carrerasRouter);

// Areas
const areasRouter = require('./routes/areas');
app.use('/areas', areasRouter);

// CPA (Carta Presentacion Alumno)
const cpaRouter = require('./routes/cpas');
app.use('/cpa', cpaRouter);

// Estudiantes
const estudiantesRouter = require('./routes/estudiantes');
app.use('/estudiantes', estudiantesRouter);

// Grados
const gradosRouter = require('./routes/grados');
app.use('/grados', gradosRouter);

// Grupos
const gruposRouter = require('./routes/grupos');
app.use('/grupos', gruposRouter);

// Periodos
const periodosRouter = require('./routes/periodos');
app.use('/periodos', periodosRouter);

// Seguimientos
const seguimientosRouter = require('./routes/seguimientos');
app.use('/seguimientos', seguimientosRouter);

// Turnos
const turnosRouter = require('./routes/turnos');
app.use('/turnos', turnosRouter);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
