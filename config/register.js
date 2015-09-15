import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import favicon from 'serve-favicon';
import RedisStore from 'connect-redis';
import glob from 'glob';

import Promise from 'bluebird';
let globAsync = Promise.promisify(glob);
let RedisSession = RedisStore(session);

export default async function (app, config) {
  // Environments
  const env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = (env === 'development');

  // Middlewares
  app.use(morgan('dev'));
  app.use(cookieParser(config.secret));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(express.static(`${ config.root }/public`));
  // app.use(favicon(`${ config.root }/public/img/favicon.ico`));
  app.use(session({
    secret: config.secret,
    store: new RedisSession(config.redis),
    resave: false,
    saveUninitialized: false
  }));

  // Controllers
  let controllers = await globAsync(`${ config.root }/controllers/**/*.js`);
  controllers.forEach((controller) => require(controller)(app));

  // Errors
  if (env === 'development') {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.send(`
        ${ err.message }
        ${ err.stack }
      `);
    });
  } else {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.send(err.message);
    });
  }

  return app;
};
