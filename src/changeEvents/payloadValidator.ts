import { plainToInstance } from "class-transformer";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, validateSync } from "class-validator";
import { CreateChangeEventDto } from "./createEvent.dto";
import {
  ChangeEventType,
  NotificationConsentChangeEventPayload,
  PayloadBase,
  PayloadsByEventType,
} from "./payload.dto";

@ValidatorConstraint({ name: "ValidatePayloadByEventType" })
export class ValidatePayloadByEventType implements ValidatorConstraintInterface {
  private lastErrors: string[] = [];

  validate(
    payload: InstanceType<(typeof PayloadsByEventType)[keyof typeof ChangeEventType]>,
    args: ValidationArguments,
  ) {
    const dtoInstance = args.object as CreateChangeEventDto;
    if (!dtoInstance.eventType || !payload) return false;

    const PayloadClass = PayloadsByEventType[dtoInstance.eventType];
    // Event type not found, should never happen as it is validated by IsEnum in CreateChangeEventDto
    if (!PayloadClass) {
      this.lastErrors = [`Invalid eventType ${dtoInstance.eventType}`];
      return false;
    }
    let payloadInstance: PayloadBase;
    switch (dtoInstance.eventType) {
      case ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE:
        payloadInstance = plainToInstance(NotificationConsentChangeEventPayload, payload, {
          enableImplicitConversion: true,
        });
        break;
      // Add new event types here
      default:
        this.lastErrors = [`Invalid eventType ${dtoInstance.eventType}`];
        return false;
    }
    // const payloadInstance = plainToInstance(PayloadClass, payload, { enableImplicitConversion: true }); // Create instance of payload class with data from the input
    const errors = validateSync(payloadInstance, {
      enableDebugMessages: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    });

    this.lastErrors = errors.map((err) => `${err.property}: ${Object.values(err.constraints || {}).join(", ")}`);
    return errors.length === 0; // Valid if no errors
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid payload for eventType ${(args.object as CreateChangeEventDto).eventType}:
    ${this.lastErrors.join("\n")}`;
  }
}
