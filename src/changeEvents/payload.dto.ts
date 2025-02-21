import { SubscriptionState } from "./subscriptionEvent.helpers";
import { IsDefined, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export type SubscriptionType = "email_notifications" | "sms_notifications";

export const ChangeEventType = {
  NOTIFICATION_PREFERENCE_CHANGE: "NOTIFICATION_PREFERENCE_CHANGE",
} as const;

class UserWithId {
  @IsUUID()
  id: string;
}
export class PayloadBase {
  @ValidateNested()
  @Type(() => UserWithId)
  @IsDefined()
  user: UserWithId;
}

/**
 * Payload for a notification consent change event.
 * Validates the user and consents fields.
 */
export class NotificationConsentChangeEventPayload extends PayloadBase {
  @IsDefined()
  @ValidateNested()
  consents: SubscriptionState;
}

// Add new payload classes here
// export class NewPayload extends PayloadBase {}

/**
 * A map of event types to their respective payloads.
 * This is used to validate the payload of a change event based on its type.
 * @example
 * TODO
 */
export const PayloadsByEventType: Record<keyof typeof ChangeEventType, typeof PayloadBase> = {
  [ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE]: NotificationConsentChangeEventPayload,
} as const;
