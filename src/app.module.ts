import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { connectionConfig } from "./ormconfig";
import { User } from "./users/User.entity";
import { ChangeEvent } from "./changeEvents/ChangeEvent.entity";
import { UserModule } from "./users/user.module";
import { ChangeEventModule } from "./changeEvents/changeEvent.module";

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
