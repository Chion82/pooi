import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import favicon from 'serve-favicon';
import RedisStore from 'connect-redis';
import glob from 'glob';

let RedisSession = RedisStore(session);

export default function (app, io, config) {
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
  app.use(favicon(`${ config.root }/public/img/favicon.ico`));
  let sessionMiddleware = session({
    secret: config.secret,
    store: new RedisSession(config.redis),
    resave: false,
    saveUninitialized: false
  });
  app.use(sessionMiddleware);
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  // Controllers
  let controllers = glob.sync(`${ config.root }/controllers/**/*.js`);
  controllers.forEach((controller) => {
    require(controller)(app, io);
  });

  // Errors
  if (env === 'development') {
    app.use((err, req, res, next) => {
      next(err);
      res.status(err.status || 500);
      res.send(`
        ${ err.message }
        ${ err.stack }
      `);
    });
  } else {
    app.use((err, req, res, next) => {
      next(err);
      res.status(err.status || 500);
      res.send(err.message);
    });
  }

  return app;
}
