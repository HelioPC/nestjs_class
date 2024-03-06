import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'mysql://root:8EvlcUciChlyefOVedot@localhost:9306/bookmark',
        },
      },
    });
  }
}
