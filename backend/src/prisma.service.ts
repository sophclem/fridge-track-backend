import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {


  constructor() {
    const adapter = new PrismaPg({
      connectionString:
        process.env.DATABASE_URL ||
        'postgresql://fridge:secret@localhost:5432/fridge',
    });

    super({ adapter });
  }
  async onModuleInit() {
    // Connect to the database when the app starts
    await this.$connect();
  }

}