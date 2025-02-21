import { Body, Controller, Post } from "@nestjs/common";
import { ChangeEventService } from "./changeEvent.service";
import { CreateChangeEventDto } from "./createEvent.dto";

@Controller("events")
export class ChangeEventController {
  constructor(private readonly changeEventService: ChangeEventService) {}

  /**
   * Creates a new change event.
   * Currently supports only notification preference change events.
   * 
   * @throws {404} If the user does not exist.
   */
  @Post()
  async createChangeEvent(@Body() body: CreateChangeEventDto) {
    return this.changeEventService.insertChangeEvent(body.payload.user.id, body.eventType, body.payload);
  }
}
