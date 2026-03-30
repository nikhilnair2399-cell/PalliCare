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
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

interface VerifiedClient {
  userId: string;
  role: string;
}

/**
 * PalliCare WebSocket Gateway (Socket.IO)
 *
 * Real-time channels:
 *   - alert:new          -- Clinician dashboard receives new clinical alerts
 *   - alert:updated      -- Alert acknowledged/resolved/escalated
 *   - patient:log        -- New symptom log submitted (for clinician live view)
 *   - patient:vitals     -- Real-time patient status change
 *   - notification:push  -- In-app notification for any user
 *   - sync:status        -- Sync progress updates for mobile client
 *   - consent:updated    -- DPDPA consent status changed
 *   - assignment:request  -- New patient-clinician assignment requested
 *   - assignment:approved -- Assignment approved
 *   - data:deleted       -- Data deletion completed (DPDPA Section 12)
 *
 * Rooms:
 *   - clinician:{userId}  -- Individual clinician's room
 *   - patient:{patientId} -- Patient-specific room (clinician + caregiver)
 *   - department:{dept}   -- Department-wide broadcast
 *
 * Authentication:
 *   JWT is verified on handleConnection. Unauthenticated clients are
 *   disconnected immediately. The verified payload (userId, role) is
 *   stored in connectedClients and used for room assignment.
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
  private connectedClients = new Map<string, VerifiedClient>();

  constructor(private readonly jwtService: JwtService) {}

  // --- Connection Lifecycle (JWT-authenticated) ---

  handleConnection(client: Socket) {
    try {
      // Extract token from handshake auth or query string
      const token =
        client.handshake.auth?.token ??
        (client.handshake.query?.token as string | undefined);

      if (!token) {
        this.logger.warn(`Client ${client.id} rejected: no token provided`);
        client.emit('auth:error', { message: 'Authentication required' });
        client.disconnect(true);
        return;
      }

      // Verify JWT
      const payload = this.jwtService.verify(token);

      if (!payload.sub || !payload.role) {
        this.logger.warn(`Client ${client.id} rejected: invalid token payload`);
        client.emit('auth:error', { message: 'Invalid token payload' });
        client.disconnect(true);
        return;
      }

      const userId = payload.sub as string;
      const role = payload.role as string;

      // Store verified identity
      this.connectedClients.set(client.id, { userId, role });

      // Auto-assign rooms based on verified role
      if (role === 'clinician') {
        client.join(`clinician:${userId}`);
        client.join('department:palliative-care');
        this.logger.log(
          `Clinician ${userId} connected and joined dashboard room`,
        );
      } else if (role === 'patient') {
        client.join(`patient:${userId}`);
        this.logger.log(`Patient ${userId} connected and joined patient room`);
      } else if (role === 'caregiver') {
        client.join(`caregiver:${userId}`);
        this.logger.log(
          `Caregiver ${userId} connected and joined caregiver room`,
        );
      }

      client.emit('auth:success', { userId, role });

      this.logger.log(
        `Client connected: ${client.id} (${this.connectedClients.size} total)`,
      );
    } catch (error) {
      this.logger.warn(
        `Client ${client.id} rejected: JWT verification failed -- ${error.message}`,
      );
      client.emit('auth:error', { message: 'Token expired or invalid' });
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(
      `Client disconnected: ${client.id} (${this.connectedClients.size} total)`,
    );
  }

  // --- Room Join (role-validated) ---

  @SubscribeMessage('room:join')
  handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    const clientInfo = this.connectedClients.get(client.id);
    if (!clientInfo) {
      return { event: 'room:error', data: { message: 'Not authenticated' } };
    }

    const { userId, role } = clientInfo;
    const room = data.room;

    // Validate room access based on role
    if (role === 'clinician') {
      // Clinicians can join clinician:*, department:*, and patient:* rooms
      if (
        room.startsWith('clinician:') ||
        room.startsWith('department:') ||
        room.startsWith('patient:')
      ) {
        client.join(room);
        this.logger.debug(`Clinician ${userId} joined room: ${room}`);
        return { event: 'room:joined', data: { room } };
      }
    } else if (role === 'patient') {
      // Patients can only join their own patient room
      if (room === `patient:${userId}`) {
        client.join(room);
        this.logger.debug(`Patient ${userId} joined room: ${room}`);
        return { event: 'room:joined', data: { room } };
      }
    } else if (role === 'caregiver') {
      // Caregivers can join patient rooms they are assigned to
      // (assignment validation should be done at a higher level;
      //  here we only allow caregiver:* and patient:* prefixes)
      if (room.startsWith('caregiver:') || room.startsWith('patient:')) {
        client.join(room);
        this.logger.debug(`Caregiver ${userId} joined room: ${room}`);
        return { event: 'room:joined', data: { room } };
      }
    }

    this.logger.warn(
      `Room join denied: ${role} ${userId} tried to join ${room}`,
    );
    return { event: 'room:error', data: { message: 'Access denied' } };
  }

  @SubscribeMessage('room:leave')
  handleRoomLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    client.leave(data.room);
    return { event: 'room:left', data: { room: data.room } };
  }

  // --- Server-Side Emit Methods (called by services) ---

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

  // --- DPDPA / Assignment Emit Methods ---

  /** Notify a user that their consent status has changed */
  emitConsentUpdated(userId: string, consent: {
    consentType: string;
    status: 'granted' | 'revoked';
    timestamp: string;
  }) {
    this.server
      .to(`patient:${userId}`)
      .to(`clinician:${userId}`)
      .emit('consent:updated', consent);
    this.logger.log(
      `Consent ${consent.status}: ${consent.consentType} for user ${userId}`,
    );
  }

  /** Notify clinicians of a new patient assignment request */
  emitAssignmentRequest(assignment: {
    id: string;
    patientId: string;
    patientName: string;
    requestedClinicianId: string;
    department: string;
  }) {
    // Notify the specific clinician and the department
    this.server
      .to(`clinician:${assignment.requestedClinicianId}`)
      .to(`department:${assignment.department}`)
      .emit('assignment:request', assignment);
    this.logger.log(
      `Assignment request: ${assignment.patientName} -> clinician ${assignment.requestedClinicianId}`,
    );
  }

  /** Notify patient and clinician that an assignment was approved */
  emitAssignmentApproved(assignment: {
    id: string;
    patientId: string;
    clinicianId: string;
    clinicianName: string;
  }) {
    this.server
      .to(`patient:${assignment.patientId}`)
      .to(`clinician:${assignment.clinicianId}`)
      .emit('assignment:approved', assignment);
    this.logger.log(
      `Assignment approved: patient ${assignment.patientId} <-> clinician ${assignment.clinicianId}`,
    );
  }

  /** Notify a user that their data deletion request has been completed (DPDPA Section 12) */
  emitDataDeleted(userId: string, deletion: {
    requestId: string;
    type: string;
    completedAt: string;
  }) {
    this.server
      .to(`patient:${userId}`)
      .emit('data:deleted', deletion);
    this.logger.log(
      `Data deletion completed: ${deletion.type} for user ${userId}`,
    );
  }

  // --- Utility ---

  /** Get count of connected clients */
  getConnectedCount(): number {
    return this.connectedClients.size;
  }

  /** Get connected clinicians */
  getConnectedClinicians(): string[] {
    return Array.from(this.connectedClients.entries())
      .filter(([, meta]) => meta.role === 'clinician')
      .map(([, meta]) => meta.userId)
      .filter(Boolean);
  }
}
