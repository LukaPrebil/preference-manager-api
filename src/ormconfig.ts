import { DataSource, DataSourceOptions } from 'typeorm';

export const connectionConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'preferences',
  entities: ['dist/**/*.entity.js'], // Ensure it matches compiled entity paths
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // Never enable this in production
  logging: true,
}

const dataSource = new DataSource(connectionConfig);
dataSource.initialize().then(() => console.log('Database connection established')).catch(console.error);

export default dataSource
