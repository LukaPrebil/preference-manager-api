import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/User.entity";
import { ChangeEvent } from "./ChangeEvent.entity";
import { ChangeEventController } from "./changeEvent.controller";
import { ChangeEventService } from "./changeEvent.service";

@Module({
  imports: [TypeOrmModule.forFeature([ChangeEvent, User])],
  controllers: [ChangeEventController],
  providers: [ChangeEventService],
})
export class ChangeEventModule {}
