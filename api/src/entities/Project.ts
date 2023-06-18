import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Thread } from "./Thread";


@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("text")
  url: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (u) => u.todos)
  @JoinColumn({ name: "userId" })
  creator: Promise<User>;

  @OneToMany(() => Thread, (t) => t.userId)
  threads: Promise<Thread[]>;
}
