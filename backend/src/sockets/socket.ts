import { Server } from 'socket.io';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);

    socket.on('project:join', (projectId: number) => {
      const roomName = `project_${projectId}`;
      socket.join(roomName);
    });

    socket.on('project:leave', (projectId: number) => {
      const roomName = `project_${projectId}`;
      socket.leave(roomName);
    });

    socket.on('task:created', ({ projectId, task }) => {
      const roomName = `project_${projectId}`;
      socket.to(roomName).emit('task:created:notify', task);
    });

    socket.on('task:updated', ({ projectId, task }) => {
      const roomName = `project_${projectId}`;
      socket.to(roomName).emit('task:updated:notify', task);
    });

    socket.on('task:deleted', ({ projectId, task }) => {
      const roomName = `project_${projectId}`;
      socket.to(roomName).emit('task:deleted:notify', task);
    });
  });
};
