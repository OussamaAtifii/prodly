import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { CLIENT_URL, PORT } from './config/config';
import { setupSocket } from './sockets/socket';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
  },
});

setupSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
