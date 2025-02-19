import { Module } from "@nestjs/common";
import { ChangeEventService } from "./changeEvent.service";
import { ChangeEventController } from "./changeEvent.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChangeEvent } from "./ChangeEvent.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ChangeEvent])],
  controllers: [ChangeEventController],
  providers: [ChangeEventService],
})
export class ChangeEventModule {}