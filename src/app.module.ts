import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { BlockModule } from './block/block.module';
import { ExecuterModule } from './executer/executer.module';

@Module({
  imports: [ConfigModule, DatabaseModule, ExecuterModule, BlockModule]
})
export class AppModule { }
