import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  users: any;
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}
