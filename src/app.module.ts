import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { connectionConfig } from './ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/User.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads .env file
    TypeOrmModule.forRoot({
      ...connectionConfig,
      entities: [User],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
