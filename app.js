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

// CPA (Carta Presentacion Alumno)
const cpaRouter = require('./routes/cpas');
app.use('/cpa', cpaRouter);

// Estudiantes
const estudiantesRouter = require('./routes/estudiantes');
app.use('/estudiantes', estudiantesRouter);

// Periodos
const periodosRouter = require('./routes/periodos');
app.use('/periodos', periodosRouter);

// Seguimientos academicos
const seguimientosRouter = require('./routes/seguimientosAcademicos');
app.use('/seguimientos', seguimientosRouter);

// Documentos (Segumientos administrativos)
const seguimientosRouter = require('./routes/seguimientosAdministrativos');
app.use('/documentos', seguimientosRouter);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
