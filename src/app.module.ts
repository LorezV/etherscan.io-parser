import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { EtherModule } from './ether/ether.module';
import { ExecuterModule } from './executer/executer.module';

@Module({
  imports: [ConfigModule, DatabaseModule, ExecuterModule, EtherModule]
})
export class AppModule { }
