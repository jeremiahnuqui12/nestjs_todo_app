import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskEntity } from './task.entity/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { simpleFunc } from 'src/middleware/session.middleware';


@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity])],
  providers: [TaskService],
  controllers: [TaskController]
})

export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(simpleFunc).forRoutes(TaskController);
  }
}
