import { ChangeEventType } from "./payload.dto";
import { mergeSubscriptionConsentChangeEvents } from "./subscriptionEvent.helpers";
import { SubscriptionChangeEvent, SubscriptionState } from "./subscriptionEvent.helpers";

describe("mergeSubscriptionConsentChangeEvents", () => {
  it("should merge a single consent change event", () => {
    const events: SubscriptionChangeEvent[] = [
      {
        event_type: ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE,
        payload: {
          consents: [
            { id: "email_notifications", enabled: true },
            { id: "sms_notifications", enabled: false },
          ],
        },
      } as SubscriptionChangeEvent,
    ];

    const result: SubscriptionState = mergeSubscriptionConsentChangeEvents(events);

    expect(result).toEqual([
      { id: "email_notifications", enabled: true },
      { id: "sms_notifications", enabled: false },
    ]);
  });

  it("should merge multiple consent change events", () => {
    const events: SubscriptionChangeEvent[] = [
      {
        event_type: ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE,
        payload: {
          consents: [
            { id: "email_notifications", enabled: true },
            { id: "sms_notifications", enabled: false },
          ],
        },
      } as SubscriptionChangeEvent,
      {
        event_type: ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE,
        payload: {
          consents: [{ id: "email_notifications", enabled: false }],
        },
      } as SubscriptionChangeEvent,
    ];

    const result: SubscriptionState = mergeSubscriptionConsentChangeEvents(events);

    expect(result).toEqual([
      { id: "email_notifications", enabled: false },
      { id: "sms_notifications", enabled: false },
    ]);
  });

  it("should handle missing consents in some events", () => {
    const events: SubscriptionChangeEvent[] = [
      {
        event_type: ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE,
        payload: {
          consents: [{ id: "email_notifications", enabled: true }],
        },
      } as SubscriptionChangeEvent,
      {
        event_type: ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE,
        payload: {
          consents: [],
        },
      } as unknown as SubscriptionChangeEvent,
    ];

    const result: SubscriptionState = mergeSubscriptionConsentChangeEvents(events);

    expect(result).toEqual([
      { id: "email_notifications", enabled: true },
      { id: "sms_notifications", enabled: false }, // Default to false
    ]);
  });

  it("should return default state if no events are provided", () => {
    const events: SubscriptionChangeEvent[] = [];

    const result: SubscriptionState = mergeSubscriptionConsentChangeEvents(events);

    expect(result).toEqual([
      { id: "email_notifications", enabled: false },
      { id: "sms_notifications", enabled: false },
    ]);
  });

  it("should handle an event with only one consent type", () => {
    const events: SubscriptionChangeEvent[] = [
      {
        event_type: ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE,
        payload: {
          consents: [{ id: "sms_notifications", enabled: true }],
        },
      } as SubscriptionChangeEvent,
    ];

    const result: SubscriptionState = mergeSubscriptionConsentChangeEvents(events);

    expect(result).toEqual([
      { id: "email_notifications", enabled: false }, // Default to false
      { id: "sms_notifications", enabled: true },
    ]);
  });
});
