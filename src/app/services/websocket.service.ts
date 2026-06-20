import { Injectable } from '@angular/core';
import { environment } from '../env';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private readonly apiUrl = `${environment.BASIC_URL}`;

  socket!: WebSocket;

  connect() {
    this.socket = new WebSocket(`${this.apiUrl}ws`);

    this.socket.onmessage = (event) => {
      console.log("Log:", event.data);
    };
  }

  send(message: string) {
    this.socket.send(message);
  }
}
