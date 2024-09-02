import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  autoLoadEntities: true,
  synchronize: false,
};

const typeOrmDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: ['dist/db/models/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
}

export default new DataSource(typeOrmDataSourceOptions)