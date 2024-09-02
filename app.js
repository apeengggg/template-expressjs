require('dotenv').config();

const express = require('express');
const BodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');

const app = express();
const port = process.env.SERVER_PORT || 3000;
const routes = require('./src/routes');
const logger = require('./src/utils/LoggerUtil');

app.use('/api/v1', routes);

app.use(cors());
app.use(BodyParser.json({ limit: '50mb' }));
app.use(BodyParser.urlencoded({ limit: '50mb', extended: true }));

// register base path '/'
app.get('/', (req, res) =>
  res.send(`${process.env.APP_NAME}-${process.env.APP_VERSION}`)
);

// register static file
app.use(express.static(__dirname + '/public'));

// register all route under '/api/v1'
// app.use('/api/v1', routes);

// register error handler from Joi->Celebrate
app.use(errors());

app.listen(port, () => {
  logger.info(`Server started, listening on port ${port}!`);
});
