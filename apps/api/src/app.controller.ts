import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  private readonly startTime = Date.now();

  @Get('/')
  root() {
    return {
      app: 'PalliCare API',
      description:
        'AIIMS Bhopal Palliative Care & Pain Management Platform API',
      version: '1.0.0',
      status: 'running',
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      timestamp: new Date().toISOString(),
      docs: '/docs',
      health: '/api/v1/health',
      endpoints: {
        auth: '/api/v1/auth',
        patients: '/api/v1/patients',
        medications: '/api/v1/medications',
        wellness: '/api/v1/wellness',
        education: '/api/v1/education',
        messages: '/api/v1/messages',
      },
    };
  }
}
