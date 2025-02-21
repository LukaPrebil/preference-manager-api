import { ChangeEvent } from "./ChangeEvent.entity";
import { ChangeEventType, SubscriptionType } from "./payload.dto";

export type SubscriptionChange = {
  email_notifications: boolean;
  sms_notifications: boolean;
};

export type SubscriptionChangeEvent = ChangeEvent & {
  eventType: (typeof ChangeEventType)["NOTIFICATION_PREFERENCE_CHANGE"];
  payload: Partial<SubscriptionChange>;
};

/**
 * This is a type that represents the state of the user's subscription preferences.
 * It is an array of objects, each object representing a subscription type (email or sms) and whether it is enabled or not.
 * There can be only one object for each subscription type. The SubscriptionType union is used to define the possible subscription types.
 */
export type SubscriptionState = { [K in SubscriptionType]: { id: K; enabled: boolean } }[SubscriptionType][];

/**
 * Takes an array of subscription change events and merges them into a single subscription state.
 * @param subscriptionChangeEvents
 * @returns
 */
export function mergeSubscriptionConsentChangeEvents(
  subscriptionChangeEvents: SubscriptionChangeEvent[],
): SubscriptionState {
  const reducedChangeEvents = subscriptionChangeEvents.reduce(
    (state, changeEvent) => {
      const payload = changeEvent.payload as Partial<SubscriptionChange>;

      return {
        email_notifications: payload.email_notifications ?? state.email_notifications,
        sms_notifications: payload.sms_notifications ?? state.sms_notifications,
      };
    },
    {
      email_notifications: false,
      sms_notifications: false,
    },
  );

  return Object.entries(reducedChangeEvents).map(([id, enabled]) => ({ id: id as SubscriptionType, enabled }));
}
