import { join } from "path"
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";
import 'dotenv/config';

export const typeOrmModuleOptions = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    synchronize: false,
    migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
    migrationsTableName: 'migrations',
    logging: true,
});

const dataSourceOptions: DataSourceOptions = ({
    type: 'postgres',
    schema: 'public',
    host: process.env.DATABASE_HOST ,
    port: +process.env.DATABASE_PORT ,
    username: process.env.DATABASE_USERNAME ,
    password: process.env.DATABASE_PASSWORD ,
    database: process.env.DATABASE_NAME ,
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    synchronize: false,
    migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
    migrationsTableName: 'migrations',
    logging: true,
});

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
