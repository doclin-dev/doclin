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

  @Column({nullable: true})
  anonymous: string;

  @ManyToOne(() => User, (user) => user.replies)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Thread, (thread) => thread.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "threadId" })
  thread: Thread;
}
