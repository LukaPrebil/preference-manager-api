import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/User.entity";

export const enum ChangeEventType {
  NOTIFICATION_PREFERENCE_CHANGE = "NOTIFICATION_PREFERENCE_CHANGE",
}

export type SubscriptionType = "email_notifications" | "sms_notifications";

@Entity()
export class ChangeEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    (user) => user.changeEvents,
  )
  user: User;

  @Column()
  event_type: ChangeEventType; // This allows us to extend this table to track other events in the future

  @Column({ type: "json" })
  payload: Record<string, unknown>;

  @CreateDateColumn()
  created!: Date;
}

export interface CreateChangeEventDto {
  userId: string;
  eventType: ChangeEventType;
  payload: Record<string, unknown>;
}
