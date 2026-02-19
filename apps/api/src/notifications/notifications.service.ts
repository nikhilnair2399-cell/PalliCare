import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(private readonly notifRepo: NotificationsRepository) {}

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
}
