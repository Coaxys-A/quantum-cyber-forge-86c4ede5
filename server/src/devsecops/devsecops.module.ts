import { Module } from '@nestjs/common';
import { DevSecOpsController } from './devsecops.controller';
import { DevSecOpsService } from './devsecops.service';

@Module({
  controllers: [DevSecOpsController],
  providers: [DevSecOpsService],
})
export class DevSecOpsModule {}
