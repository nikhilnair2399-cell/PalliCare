import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { PushService, PushPayload } from '../common/push/push.service';
import { DevicesService } from '../devices/devices.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger('NotificationsService');

  constructor(
    private readonly notifRepo: NotificationsRepository,
    private readonly pushService: PushService,
    private readonly devicesService: DevicesService,
  ) {}

  async list(userId: string, params: {
    unreadOnly?: boolean;
    type?: string;
    page?: number;
    perPage?: number;
  }) {
    return this.notifRepo.findByUser(userId, params);
  }

  async markAsRead(notificationId: string, userId: string) {
    const notif = await this.notifRepo.markAsRead(notificationId, userId);
    if (!notif) throw new NotFoundException('Notification not found');
    return notif;
  }

  async markAllAsRead(userId: string) {
    return this.notifRepo.markAllAsRead(userId);
  }

  async registerDevice(data: {
    userId: string;
    fcmToken: string;
    platform: string;
    deviceId?: string;
  }) {
    return this.notifRepo.upsertDeviceToken(data);
  }

  async getPreferences(userId: string) {
    return this.notifRepo.getPreferences(userId);
  }

  async updatePreference(userId: string, type: string, data: Record<string, any>) {
    return this.notifRepo.upsertPreference(userId, type, data);
  }

  async unreadCount(userId: string) {
    return { count: await this.notifRepo.unreadCount(userId) };
  }

  /**
   * Create a notification record and deliver via push notification.
   * Used by other services (clinical-alerts, medications, etc.) to send
   * both in-app and push notifications.
   */
  async createAndSend(
    userId: string,
    notification: {
      type: string;
      title: string;
      body: string;
      data?: Record<string, string>;
      priority?: 'high' | 'normal';
    },
  ) {
    // 1. Save notification to database
    const saved = await this.notifRepo.create(userId, {
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data,
    });

    // 2. Get user's active FCM tokens
    const tokens = await this.devicesService.getActiveTokens(userId);
    if (!tokens || tokens.length === 0) {
      this.logger.debug(`No active devices for user ${userId} — skipping push`);
      return saved;
    }

    // 3. Send push notification
    const fcmTokens = tokens.map((t: { fcm_token: string }) => t.fcm_token);
    const payload: PushPayload = {
      title: notification.title,
      body: notification.body,
      data: {
        notificationId: saved.id,
        type: notification.type,
        ...notification.data,
      },
      priority: notification.priority ?? 'normal',
    };

    await this.pushService.sendToTokens(fcmTokens, payload);
    return saved;
  }
}
