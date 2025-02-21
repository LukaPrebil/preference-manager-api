import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/User.entity";
import { ChangeEventType, PayloadBase } from "./payload.dto";

@Entity()
export class ChangeEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    (user) => user.changeEvents,
  )
  user: User;

  @Column({ type: "enum", enum: typeof ChangeEventType })
  event_type: keyof typeof ChangeEventType; // This allows us to extend this table to track other events in the future

  @Column({ type: "json" })
  payload: PayloadBase;

  @CreateDateColumn()
  created!: Date;
}
