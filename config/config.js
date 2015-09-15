import path from 'path';

const rootPath = path.normalize(`${ __dirname }/..`);
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'pooi'
    },
    port: 6001,
    db: 'mongodb://localhost/pooi-development',
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
    secret: 'YourSecretDevelopment'
  },
  production: {
    root: rootPath,
    app: {
      name: 'pooi'
    },
    port: 6001,
    db: 'mongodb://localhost/pooi-production',
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
    secret: 'YourSecretProduction'
  },
  test: {
    root: rootPath,
    app: {
      name: 'pooi'
    },
    port: 6001,
    db: 'mongodb://localhost/pooi-test',
    redis: {
      host: '127.0.0.1',
      port: 6379,
    },
    secret: 'YourSecretTest'
  }
};

export default config[env];
