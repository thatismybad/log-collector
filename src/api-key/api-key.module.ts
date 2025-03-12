import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { ApiKeyService } from './api-key.service';
import { ApiKeyController } from './api-key.controller';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeyService, PrismaService],
})
export class ApiKeyModule {}
