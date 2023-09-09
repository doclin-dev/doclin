import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from "typeorm";
import { User } from "./User";
import { Thread } from "./Thread";


@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column("text")
  name: string;

  @Column("text")
  url: string;

  @Column({ nullable: true})
  userId: number;

  @ManyToOne(() => User, (user) => user.projects)
  creator: Promise<User>;

  @OneToMany(() => Thread, (thread) => thread.project)
  threads: Promise<Thread[]>;
}
