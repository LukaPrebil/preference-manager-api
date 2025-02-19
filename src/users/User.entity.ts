import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ChangeEvent } from "../changeEvents/ChangeEvent.entity";
import { SubscriptionState } from "src/changeEvents/subscriptionEvent.helpers";

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
}

export interface CreateUserDto {
  email: string;
}

export interface UserDto {
  id: string;
  email: string;
  consents: SubscriptionState;
}
