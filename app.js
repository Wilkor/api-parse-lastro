require('dotenv').config();
const http = require('http');
const express = require('express')
const cors = require('cors');
const helmet = require('helmet')
const bodyParser = require('body-parser');
const config = require('./src/utils/index');
const configEnv = require('./src/helpers/readConfig');
const initMongo = require('./src/helpers/connectMongo');

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use(express.json());


configEnv.readEnvFile();
initMongo.init('models/v1');



let fileRoutes = config.readRecursiveDirectory('routes')
  .filter(item => {
    return item !== '';
  });

const endpointsFiles = [];
fileRoutes.forEach(file => {
  let rf = require('./src/' + file.replace('.js', ''));
  let fn = file
    .replace('routes', '')
    .split('\\')
    .join('/')
    .replace('.js', '');
  endpointsFiles.push(`./src/routes${fn}.js`)
  app.use(fn, rf);
  console.log('Rota ' + fn + ' --> ok!');
});

app.use((err, req, res, next) => {

  res.status(400).json({ message: 'Erro ao processar essa requisição', tecnica: err });
});


server.listen(process.env.PORT || 3333, () => {
  let host = server.address().address,
    port = server.address().port;

});



