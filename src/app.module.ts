import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChangeEvent } from "./changeEvents/ChangeEvent.entity";
import { ChangeEventModule } from "./changeEvents/changeEvent.module";
import { User } from "./users/User.entity";
import { UserModule } from "./users/user.module";
import { connectionConfig } from "./connectionConfig";

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads .env file
    TypeOrmModule.forRoot({
      ...connectionConfig,
      entities: [User, ChangeEvent],
    }),
    UserModule,
    ChangeEventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
