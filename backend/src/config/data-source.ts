import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
// import { User } from '../modules/user/user.entity';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [__dirname + '/../**/*.entity.{js,ts}'],
	synchronize: false, // Never ever true in Prod, since any change in entities will effect Production database
	logging: false,
	migrations: [__dirname + '/../migrations/*.{js,ts}'],
});
