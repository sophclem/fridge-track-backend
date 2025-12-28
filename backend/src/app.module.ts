import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HouseholdsModule } from './households/households.module';
import { ItemsModule } from './items/items.module';

@Module({
    imports: [
      PrismaModule,
      UsersModule,
      AuthModule,
      HouseholdsModule,
      ItemsModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
