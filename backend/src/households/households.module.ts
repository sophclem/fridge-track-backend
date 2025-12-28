import { Module } from '@nestjs/common';
import { HouseholdsService } from './households.service';
import { HouseholdsController } from './households.controller';

@Module({
  providers: [HouseholdsService],
  controllers: [HouseholdsController]
})
export class HouseholdsModule {}
