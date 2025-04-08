import { Injectable } from '@angular/core';
import { TasksStore } from '@core/store/tasks.store';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.SOCKET_URL);
  }

  get instance() {
    return this.socket;
  }
}
