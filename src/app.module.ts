import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { connectionConfig } from "./ormconfig";
import { User } from "./users/User.entity";

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
