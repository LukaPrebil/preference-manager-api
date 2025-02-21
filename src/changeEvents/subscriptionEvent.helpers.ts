import { ChangeEventType, SubscriptionType } from "./payload.dto";

/**
 * This is a type that represents the state of the user's subscription preferences.
 * It is an array of objects, each object representing a subscription type (email or sms) and whether it is enabled or not.
 * There can be only one object for each subscription type. The SubscriptionType union is used to define the possible subscription types.
 */
export type SubscriptionState = { [K in SubscriptionType]: { id: K; enabled: boolean } }[SubscriptionType][];

export type SubscriptionChangeEvent = {
  event_type: (typeof ChangeEventType)["NOTIFICATION_PREFERENCE_CHANGE"];
  payload: {
    consents: SubscriptionState;
  };
};

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
      for (const c of changeEvent.payload.consents) {
        state[c.id] = c.enabled;
      }
      return state;
    },
    {} as { [K in SubscriptionType]: boolean },
  );

  return [
    { id: "email_notifications", enabled: !!reducedChangeEvents.email_notifications },
    { id: "sms_notifications", enabled: !!reducedChangeEvents.sms_notifications },
  ];
}
