import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Thread } from "./Thread";

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  name: string;

  @Column("text")
  url: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (u) => u.comments)
  @JoinColumn({ name: "userId" })
  user: Promise<User>;

  @Column()
  threadId: number;

  @ManyToOne(() => Thread, (t) => t.comments)
  @JoinColumn({ name: "threadId" })
  thread: Promise<Thread>;
}
