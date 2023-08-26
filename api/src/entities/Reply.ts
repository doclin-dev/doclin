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
export class Reply extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  message: string;

  @Column({nullable: true})
  userId: number;

  @Column()
  threadId: number;

  @ManyToOne(() => User, (user) => user.replies)
  @JoinColumn({ name: "userId" })
  user: Promise<User>;

  @ManyToOne(() => Thread, (thread) => thread.replies)
  @JoinColumn({ name: "threadId" })
  thread: Promise<Thread>;
}
