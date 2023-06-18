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
  message: string;

  @Column({nullable: true})
  userId: number;

  @Column()
  threadId: number;

  @ManyToOne(() => User, (u) => u.comments)
  @JoinColumn({ name: "userId" })
  user: Promise<User>;

  @ManyToOne(() => Thread, (t) => t.comments)
  @JoinColumn({ name: "threadId" })
  thread: Promise<Thread>;
}
