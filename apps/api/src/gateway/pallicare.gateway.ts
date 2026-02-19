import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

/**
 * PalliCare WebSocket Gateway (Socket.IO)
 *
 * Real-time channels:
 *   - alert:new         — Clinician dashboard receives new clinical alerts
 *   - alert:updated     — Alert acknowledged/resolved/escalated
 *   - patient:log       — New symptom log submitted (for clinician live view)
 *   - patient:vitals    — Real-time patient status change
 *   - notification:push — In-app notification for any user
 *   - sync:status       — Sync progress updates for mobile client
 *
 * Rooms:
 *   - clinician:{userId}  — Individual clinician's room
 *   - patient:{patientId} — Patient-specific room (clinician + caregiver)
 *   - department:{dept}   — Department-wide broadcast
 */
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  },
  namespace: '/ws',
  transports: ['websocket', 'polling'],
})
export class PalliCareGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger('PalliCareGateway');
  private connectedClients = new Map<string, { userId?: string; role?: string }>();

  // ─── Connection Lifecycle ─────────────────────────────────

  handleConnection(client: Socket) {
    this.connectedClients.set(client.id, {});
    this.logger.log(
      `Client connected: ${client.id} (${this.connectedClients.size} total)`,
    );
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(
      `Client disconnected: ${client.id} (${this.connectedClients.size} total)`,
    );
  }

  // ─── Authentication / Room Join ───────────────────────────

  @SubscribeMessage('auth:join')
  handleAuthJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; role: string },
  ) {
    this.connectedClients.set(client.id, {
      userId: data.userId,
      role: data.role,
    });

    // Join role-based room
    if (data.role === 'clinician') {
      client.join(`clinician:${data.userId}`);
      client.join('department:palliative-care');
      this.logger.log(`Clinician ${data.userId} joined dashboard room`);
    } else if (data.role === 'patient') {
      client.join(`patient:${data.userId}`);
      this.logger.log(`Patient ${data.userId} joined patient room`);
    }

    return { event: 'auth:joined', data: { success: true } };
  }

  @SubscribeMessage('room:join')
  handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    client.join(data.room);
    this.logger.debug(`Client ${client.id} joined room: ${data.room}`);
    return { event: 'room:joined', data: { room: data.room } };
  }

  @SubscribeMessage('room:leave')
  handleRoomLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    client.leave(data.room);
    return { event: 'room:left', data: { room: data.room } };
  }

  // ─── Server-Side Emit Methods (called by services) ────────

  /** Broadcast new clinical alert to all clinicians */
  emitNewAlert(alert: {
    id: string;
    patientId: string;
    patientName: string;
    type: string;
    message: string;
  }) {
    this.server
      .to('department:palliative-care')
      .emit('alert:new', alert);
    this.logger.log(`Alert broadcast: ${alert.type} for ${alert.patientName}`);
  }

  /** Notify when alert status changes */
  emitAlertUpdated(alert: {
    id: string;
    status: string;
    updatedBy: string;
  }) {
    this.server
      .to('department:palliative-care')
      .emit('alert:updated', alert);
  }

  /** Broadcast new symptom log to clinician dashboard */
  emitNewSymptomLog(log: {
    patientId: string;
    patientName: string;
    painScore: number;
    logType: string;
    timestamp: string;
  }) {
    this.server
      .to('department:palliative-care')
      .to(`patient:${log.patientId}`)
      .emit('patient:log', log);
  }

  /** Push notification to a specific user */
  emitNotification(userId: string, notification: {
    id: string;
    title: string;
    body: string;
    priority: string;
    deepLink?: string;
  }) {
    this.server
      .to(`clinician:${userId}`)
      .to(`patient:${userId}`)
      .emit('notification:push', notification);
  }

  /** Sync status update for mobile client */
  emitSyncStatus(userId: string, status: {
    synced: number;
    failed: number;
    conflicts: number;
    complete: boolean;
  }) {
    this.server
      .to(`patient:${userId}`)
      .emit('sync:status', status);
  }

  // ─── Utility ──────────────────────────────────────────────

  /** Get count of connected clients */
  getConnectedCount(): number {
    return this.connectedClients.size;
  }

  /** Get connected clinicians */
  getConnectedClinicians(): string[] {
    return Array.from(this.connectedClients.entries())
      .filter(([, meta]) => meta.role === 'clinician')
      .map(([, meta]) => meta.userId!)
      .filter(Boolean);
  }
}
