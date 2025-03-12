import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { ApiKeyModule } from './api-key/api-key.module';

@Module({
  imports: [ApiKeyModule],
})
export class AppModule {}
