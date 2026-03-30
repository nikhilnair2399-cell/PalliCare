import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PalliCareGateway } from './pallicare.gateway';

@Module({
  imports: [
    // Register JwtModule with the same config used by AuthModule so that
    // the gateway verifies tokens with the same secret/options.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get(
          'JWT_SECRET',
          'pallicare-dev-secret-key-change-in-production',
        ),
        signOptions: {
          issuer: config.get('JWT_ISSUER', 'pallicare.aiims.edu'),
          audience: config.get('JWT_AUDIENCE', 'pallicare-api'),
        },
      }),
    }),
  ],
  providers: [PalliCareGateway],
  exports: [PalliCareGateway],
})
export class GatewayModule {}
