import { Module } from '@nestjs/common';
import { PalliCareGateway } from './pallicare.gateway';

@Module({
  providers: [PalliCareGateway],
  exports: [PalliCareGateway],
})
export class GatewayModule {}
