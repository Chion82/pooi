import fs from 'fs';
import express from 'express';
import glob from 'glob';
import mongoose from 'mongoose';
import config from './config/config';
import register from './config/register';

import Promise from 'bluebird';
let globAsync = Promise.promisify(glob);

(async function () {
  // Connect to MongoDB
  mongoose.connect(config.db);
  mongoose.connection.on('error', () => {
    throw new Error(`Unable to connect to database ${ config.db }`);
  });

  // Register models
  let models = await globAsync(`${ config.root }/models/*.js`);
  models.forEach((model) => require(model));

  // Prepare Express
  let app = await register(express(), config);
  app.listen(config.port, () => {
    console.log(`Wow, pooi is running at ${ config.port }.`);
  });
})();

process.on('uncaughtException', (err) => {
  console.error(err);
});
