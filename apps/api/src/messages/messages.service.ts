import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(private readonly repo: MessagesRepository) {}

  async getPatientMessages(
    patientId: string,
    params: { page?: number; perPage?: number; threadId?: string },
  ) {
    return this.repo.findByPatient(patientId, {
      page: params.page || 1,
      perPage: params.perPage || 50,
      threadId: params.threadId,
    });
  }

  async getMyMessages(
    userId: string,
    params: { page?: number; perPage?: number; unreadOnly?: boolean },
  ) {
    return this.repo.findByRecipient(userId, {
      page: params.page || 1,
      perPage: params.perPage || 50,
      unreadOnly: params.unreadOnly,
    });
  }

  async sendMessage(data: Record<string, any>) {
    return this.repo.create(data);
  }

  async markRead(messageId: string) {
    return this.repo.markRead(messageId);
  }

  async markAllRead(userId: string, patientId: string) {
    return this.repo.markAllReadForPatient(userId, patientId);
  }

  async getUnreadCount(userId: string) {
    return this.repo.getUnreadCount(userId);
  }

  async getThreads(patientId: string) {
    return this.repo.getThreads(patientId);
  }
}
