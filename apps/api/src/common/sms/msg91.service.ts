import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SendOtpOptions {
  phone: string;
  otp: string;
}

@Injectable()
export class Msg91Service {
  private readonly logger = new Logger('Msg91Service');
  private readonly authKey: string;
  private readonly senderId: string;
  private readonly templateId: string;
  private readonly dltEntityId: string;

  constructor(private readonly config: ConfigService) {
    this.authKey = this.config.get('MSG91_AUTH_KEY', '');
    this.senderId = this.config.get('MSG91_SENDER_ID', 'PALCAR');
    this.templateId = this.config.get('MSG91_TEMPLATE_OTP_ID', '');
    this.dltEntityId = this.config.get('MSG91_DLT_ENTITY_ID', '');
  }

  /**
   * Send OTP via MSG91 SMS gateway.
   * Uses the MSG91 Send OTP API.
   * @see https://docs.msg91.com/reference/send-otp
   */
  async sendOtp({ phone, otp }: SendOtpOptions): Promise<boolean> {
    if (!this.authKey) {
      this.logger.warn('MSG91_AUTH_KEY not configured — skipping SMS send');
      return false;
    }

    try {
      const response = await fetch('https://control.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: this.authKey,
        },
        body: JSON.stringify({
          template_id: this.templateId,
          mobile: phone.replace('+', ''),
          otp,
          sender: this.senderId,
          DLT_TE_ID: this.dltEntityId,
        }),
      });

      const data = (await response.json()) as { type: string; message: string };

      if (data.type === 'success') {
        this.logger.log(`OTP sent to ${phone.slice(0, 5)}***`);
        return true;
      }

      this.logger.error(`MSG91 error: ${data.message}`);
      return false;
    } catch (err) {
      this.logger.error('Failed to send OTP via MSG91', (err as Error).message);
      return false;
    }
  }

  /**
   * Send a transactional SMS (e.g., clinical alert, medication reminder).
   */
  async sendSms(phone: string, templateId: string, variables: Record<string, string>): Promise<boolean> {
    if (!this.authKey) {
      this.logger.warn('MSG91_AUTH_KEY not configured — skipping SMS');
      return false;
    }

    try {
      const response = await fetch('https://control.msg91.com/api/v5/flow/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authkey: this.authKey,
        },
        body: JSON.stringify({
          template_id: templateId,
          short_url: '0',
          recipients: [
            {
              mobiles: phone.replace('+', ''),
              ...variables,
            },
          ],
        }),
      });

      const data = (await response.json()) as { type: string; message: string };
      return data.type === 'success';
    } catch (err) {
      this.logger.error('Failed to send SMS via MSG91', (err as Error).message);
      return false;
    }
  }
}
