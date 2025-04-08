import { inject, Injectable } from '@angular/core';
import { SocketService } from '@features/events/socket.service';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectSocketService {
  private socket: Socket;
  private socketService = inject(SocketService);

  constructor() {
    this.socket = this.socketService.instance;
  }

  joinProjectRoom(projectId: number) {
    this.socket.emit('project:join', projectId);
  }

  leaveProjectRoom(projectId: number) {
    this.socket.emit('project:leave', projectId);
  }
}
