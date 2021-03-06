const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//const passport = require('passport');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });


/**
 * Instância do Express
 */
const app = express();
app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * Conexão com o banco de dados
 */
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on('connected', () => {
    console.log('Mongoose is connected');
});

db.on('error', (err) => {
    console.log(`Mongoose default connection has occured \n${err}`);
});




/**
 * Rotas
 */
fs.readdirSync(path.resolve(__dirname, 'app', 'Controllers'))
    .filter(file => (((file.indexOf('.')) !== 0) && (file !== "index.js")))
    .forEach(file => app.use(require(path.resolve(__dirname, 'app', 'Controllers', file))));





/**
 * Configuração da porta em que o servidor irá se expor
 */
const port = (process.env.PORT || 3030);
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});