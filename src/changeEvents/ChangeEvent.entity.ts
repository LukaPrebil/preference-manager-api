import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/User.entity";

export const enum ChangeEventType {
  NOTIFICATION_PREFERENCE_CHANGE = "NOTIFICATION_PREFERENCE_CHANGE",
}

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
  event_type: ChangeEventType;

  @Column({ type: "json", nullable: false })
  payload: Record<string, unknown>;
}

export interface CreateChangeEventDto {
  userId: string;
  eventType: ChangeEventType;
  payload: Record<string, unknown>;
}
