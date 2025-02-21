import { IsEnum, ValidateNested, Validate } from "class-validator";
import {
  PayloadBase,
  ChangeEventType,
  PayloadsByEventType,
} from "./payload.dto";
import { ValidatePayloadByEventType } from "./payloadValidator";
import { Type } from "class-transformer";
import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";

@ApiExtraModels(...Object.values(PayloadsByEventType))
export class CreateChangeEventDto {
  /**
   * The type of change event to create.
   * Currently supports only notification preference change events.
   */
  @ApiProperty({ enum: Object.keys(ChangeEventType) })
  @IsEnum(ChangeEventType)
  eventType: keyof typeof ChangeEventType;

  /**
   * The payload of the change event.
   */
  @ApiProperty({
    oneOf: Object.values(PayloadsByEventType).map((payload) => ({ $ref: getSchemaPath(payload) })),
    discriminator: {
      propertyName: "eventType",
      mapping: Object.fromEntries(
        Object.entries(PayloadsByEventType).map(([eventType, payloadClass]) => [
          eventType,
          getSchemaPath(payloadClass),
        ]),
      ),
    },
  })
  @ValidateNested()
  @Validate(ValidatePayloadByEventType)
  @Type(() => PayloadBase)
  payload: InstanceType<(typeof PayloadsByEventType)[keyof typeof ChangeEventType]>;
}
