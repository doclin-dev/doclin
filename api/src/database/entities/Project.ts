import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
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

  @ManyToOne(() => User, (u) => u.projects)
  @JoinColumn({ name: "userId" })
  creator: Promise<User>;

  @OneToMany(() => Thread, (t) => t.userId)
  threads: Promise<Thread[]>;
}
