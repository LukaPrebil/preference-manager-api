import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChangeEvent } from "./ChangeEvent.entity";

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
}
