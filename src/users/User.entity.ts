import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChangeEvent } from "../changeEvents/ChangeEvent.entity";

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

export class CreateUserDto {
  email: string;
}
