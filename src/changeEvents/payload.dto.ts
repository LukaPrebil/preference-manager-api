import { Type } from "class-transformer";
import { IsDefined, IsUUID, ValidateNested } from "class-validator";
import { SubscriptionState } from "./subscriptionEvent.helpers";

export type SubscriptionType = "email_notifications" | "sms_notifications";

export const ChangeEventType = {
  NOTIFICATION_PREFERENCE_CHANGE: "NOTIFICATION_PREFERENCE_CHANGE",
  // Add new event types here
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
 */
export const PayloadsByEventType = {
  [ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE]: NotificationConsentChangeEventPayload,
  // Add new payloads here
} as const;
