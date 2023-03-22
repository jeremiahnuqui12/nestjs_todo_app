import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/user.entity/user.entity';
import { TaskModule } from './task/task.module';
import { TaskEntity } from './task/task.entity/task.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "1234",
      "database": "todo_list",
      "entities": [UserEntity, TaskEntity],
      "synchronize": true
    }),
    TaskModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
