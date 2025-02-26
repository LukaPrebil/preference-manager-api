import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, Validate, ValidateNested } from "class-validator";
import { ChangeEventType, PayloadBase, PayloadT, PayloadsByEventType } from "./payload.dto";
import { ValidatePayloadByEventType } from "./payloadValidator";

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
  payload: PayloadT;
}
