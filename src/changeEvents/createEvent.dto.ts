import { IsEnum, ValidateNested, Validate } from "class-validator";
import { PayloadBase, ChangeEventType } from "./payload.dto";
import { ValidatePayloadByEventType } from "./payloadValidator";
import { Type } from "class-transformer";

export class CreateChangeEventDto {
  @IsEnum(ChangeEventType)
  eventType: keyof typeof ChangeEventType;

  @ValidateNested()
  @Validate(ValidatePayloadByEventType)
  @Type(() => PayloadBase)
  payload: PayloadBase;
}
