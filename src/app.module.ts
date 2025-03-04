import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './module/users/users.module';
import { JobModule } from './module/job/job.module';

@Module({
  imports: [UsersModule, JobModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
