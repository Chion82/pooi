export default function (app, io) {
  io.on('connection', (socket) => {
    socket.emit('session', socket.request.session);
    socket.on('foo', (value) => {
      console.log('foo!');
      socket.request.session.foo = value;
      socket.emit('session', socket.request.session);
    });
  });
}
