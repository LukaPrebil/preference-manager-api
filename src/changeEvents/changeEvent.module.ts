import { Module } from "@nestjs/common";
import { ChangeEventService } from "./changeEvent.service";
import { ChangeEventController } from "./changeEvent.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChangeEvent } from "./ChangeEvent.entity";
import { User } from "../users/User.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ChangeEvent, User])],
  controllers: [ChangeEventController],
  providers: [ChangeEventService],
})
export class ChangeEventModule {}