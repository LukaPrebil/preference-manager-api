import { createHash } from "node:crypto";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ChangeEvent, ChangeEventType } from "../changeEvents/ChangeEvent.entity";
import {
  SubscriptionChangeEvent,
  SubscriptionState,
  mergeSubscriptionConsentChangeEvents,
} from "../changeEvents/subscriptionEvent.helpers";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(
    () => ChangeEvent,
    (changeEvent) => changeEvent.user,
  )
  changeEvents: ChangeEvent[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  // Add this column to your entity!
  @DeleteDateColumn()
  deletedAt?: Date;

  hashEmail() {
    return hashEmail(this.email);
  }

  /**
   * Returns the current state of the user's consents by collapsing
   * all the user's subscription change events into a single state.
   */
  get consents(): SubscriptionState {
    return mergeSubscriptionConsentChangeEvents(
      this.changeEvents.filter(
        (changeEvent) => changeEvent.event_type === ChangeEventType.NOTIFICATION_PREFERENCE_CHANGE,
      ) as SubscriptionChangeEvent[],
    );
  }

  toDTO(): UserDto {
    return {
      id: this.id,
      email: this.email,
      consents: this.consents,
    };
  }
}

export function hashEmail(email: string) {
  return createHash("sha256").update(email).digest("hex");
}

export interface CreateUserDto {
  email: string;
}

export interface UserDto {
  id: string;
  email: string;
  consents: SubscriptionState;
}
