import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module';
import * as path from 'path';
import { dataSourceOptions } from '../config/ormconfig';
import { testDataSourceOptions } from '../config/test.ormconfig';
import { isTestEnvironment } from './common/util/functions';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(process.cwd(), '../.env'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () =>
        isTestEnvironment ? testDataSourceOptions : dataSourceOptions,
    }),
    TodosModule,
  ],
})
export class AppModule {}
