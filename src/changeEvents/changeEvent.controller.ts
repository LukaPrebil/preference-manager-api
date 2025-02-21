import { Body, Controller, Post } from "@nestjs/common";
import { ChangeEventService } from "./changeEvent.service";
import { CreateChangeEventDto } from "./createEvent.dto";

@Controller("events")
export class ChangeEventController {
  constructor(private readonly changeEventService: ChangeEventService) {}

  @Post()
  async createChangeEvent(@Body() body: CreateChangeEventDto) {
    return this.changeEventService.insertChangeEvent(body.payload.user.id, body.eventType, body.payload);
  }
}
