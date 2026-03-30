import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  /** 'high' for clinical alerts, 'normal' for general notifications */
  priority?: 'high' | 'normal';
}

@Injectable()
export class PushService implements OnModuleInit {
  private readonly logger = new Logger('PushService');
  private initialized = false;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const serviceAccountPath = this.config.get<string>('FCM_SERVICE_ACCOUNT_PATH');
    const projectId = this.config.get<string>('FCM_PROJECT_ID');

    if (!serviceAccountPath && !projectId) {
      this.logger.warn('Firebase not configured — push notifications disabled');
      return;
    }

    try {
      if (!admin.apps.length) {
        const initOptions: admin.AppOptions = {};

        if (serviceAccountPath) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const serviceAccount = require(serviceAccountPath);
          initOptions.credential = admin.credential.cert(serviceAccount);
        } else {
          // Use Application Default Credentials (e.g., on GCP/Cloud Run)
          initOptions.credential = admin.credential.applicationDefault();
          initOptions.projectId = projectId;
        }

        admin.initializeApp(initOptions);
      }

      this.initialized = true;
      this.logger.log('Firebase Admin SDK initialized');
    } catch (err) {
      this.logger.error('Failed to initialize Firebase Admin', (err as Error).message);
    }
  }

  /**
   * Send push notification to multiple FCM tokens for a user.
   * Returns the count of successfully delivered messages.
   */
  async sendToTokens(tokens: string[], payload: PushPayload): Promise<number> {
    if (!this.initialized || tokens.length === 0) return 0;

    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data ?? {},
      android: {
        priority: payload.priority === 'high' ? 'high' : 'normal',
        notification: {
          channelId: payload.priority === 'high' ? 'clinical_alerts' : 'general',
          sound: payload.priority === 'high' ? 'alert_tone' : 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: payload.priority === 'high' ? 'alert_tone.caf' : 'default',
            badge: 1,
            ...(payload.priority === 'high' && { 'interruption-level': 'time-sensitive' }),
          },
        },
      },
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);

      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            this.logger.warn(
              `Push failed for token ${tokens[idx].slice(0, 10)}...: ${resp.error?.message}`,
            );
            // Track tokens that should be cleaned up
            if (
              resp.error?.code === 'messaging/registration-token-not-registered' ||
              resp.error?.code === 'messaging/invalid-registration-token'
            ) {
              failedTokens.push(tokens[idx]);
            }
          }
        });
        // TODO: Remove invalid tokens from devices table via DevicesRepository
      }

      this.logger.log(
        `Push sent: ${response.successCount} success, ${response.failureCount} failed`,
      );
      return response.successCount;
    } catch (err) {
      this.logger.error('Push multicast failed', (err as Error).message);
      return 0;
    }
  }
}
