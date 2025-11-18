import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SimulationGateway {
  @WebSocketServer()
  server: Server;

  emitEvent(event: any) {
    this.server.emit('simulation-event', event);
  }
}
