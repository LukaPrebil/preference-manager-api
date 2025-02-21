import { validateSync, ValidationArguments } from "class-validator";
import { plainToInstance } from "class-transformer";
import { CreateChangeEventDto } from "./createEvent.dto";
import { ValidatePayloadByEventType } from "./payloadValidator";
import { ChangeEventType } from "./payload.dto";
import { NotificationConsentChangeEventPayload } from "./payload.dto";

describe("ValidatePayloadByEventType", () => {
  let validator: ValidatePayloadByEventType;

  beforeEach(() => {
    validator = new ValidatePayloadByEventType();
  });

  it("should return valid for correct payload", () => {
    const dto = new CreateChangeEventDto();
    dto.eventType = ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE;

    const payload = new NotificationConsentChangeEventPayload();
    payload.user = {
      id: "1aca4117-3ab0-4dd6-8082-4717d4fface8", // Random valid UUID
    };
    payload.consents = [
      { id: "email_notifications", enabled: true },
      { id: "sms_notifications", enabled: false },
    ];
    dto.payload = payload;

    const errors = validateSync(dto);

    expect(errors.length).toBe(0); // No validation errors should be present
  });

  it("should return invalid for missing eventType", () => {
    const dto = new CreateChangeEventDto();
    // @ts-ignore - Testing invalid state
    dto.eventType = undefined; // Missing eventType

    const payload = new NotificationConsentChangeEventPayload();
    dto.payload = payload;

    const errors = validateSync(dto);

    expect(errors.length).toBeGreaterThan(0); 
    expect(errors[0].constraints?.isEnum).toContain("eventType must be one of the following values:");
  });

  it("should return invalid for missing payload", () => {
    const dto = new CreateChangeEventDto();
    dto.eventType = ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE;

    const payload = null; // Missing payload
    // @ts-ignore - Testing invalid state
    dto.payload = payload;

    const errors = validateSync(dto);

    expect(errors.length).toBeGreaterThan(0); 
    expect(errors[0].constraints?.ValidatePayloadByEventType).toContain(
      "Invalid payload for eventType NOTIFICATION_PREFERENCE_CHANGE",
    );
  });

  it("should return invalid for unrecognized eventType", () => {
    const dto = new CreateChangeEventDto();
    // @ts-ignore - Testing invalid state
    dto.eventType = "INVALID_EVENT_TYPE";

    const payload = new NotificationConsentChangeEventPayload();
    dto.payload = payload;

    const errors = validateSync(dto);

    expect(errors.length).toBeGreaterThan(0); 
    expect(errors[0].constraints?.isEnum).toContain("eventType must be one of the following values");
  });

  it("should return detailed validation errors in the message", () => {
    const dto = new CreateChangeEventDto();
    dto.eventType = ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE;

    const payload = new NotificationConsentChangeEventPayload();
    dto.payload = payload;

    const errors = validateSync(plainToInstance(CreateChangeEventDto, { ...dto, payload }), {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors.length).toBeGreaterThan(0); 
    const message = validator.defaultMessage({ object: dto } as ValidationArguments);
    expect(message).toContain("Invalid payload for eventType NOTIFICATION_PREFERENCE_CHANGE");
  });
});
