import { Body, Controller, Post } from "@nestjs/common";
import { CreateChangeEventDto } from "./ChangeEvent.entity";
import { ChangeEventService } from "./changeEvent.service";

@Controller("change-events")
export class ChangeEventController {
  constructor(private readonly changeEventService: ChangeEventService) {}

  @Post("create")
  async createChangeEvent(@Body() body: CreateChangeEventDto) {
    return this.changeEventService.insertChangeEvent(body.userId, body.eventType, body.payload);
  }
}
