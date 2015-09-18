import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import glob from 'glob';
import mongoose from 'mongoose';
import config from './config/config';
import register from './config/register';
import sticky from 'sticky-session';

// Connect to MongoDB
mongoose.connect(config.db);
mongoose.connection.on('error', () => {
  throw new Error(`Unable to connect to database ${ config.db }`);
});

// Register models
let models = glob.sync(`${ config.root }/models/*.js`);
models.forEach((model) => require(model));

// Prepare Express
let app = express();

// Integrate Socket.IO
let server = http.createServer(app);
let io = socketio(server);

// Register Express and Socket.IO middlewares
register(app, io, config);

// Use cluster with sticky-session
if (!sticky.listen(server, config.port)) {
  console.log(`Wow, pooi is running at ${ config.port }.`);
}

process.on('uncaughtException', (err) => {
  console.error(err);
});
