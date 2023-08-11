import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Thread } from "./Thread";

@Entity()
export class ThreadFile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filepath: string;

  @Column()
  threadId: number;

  @Column({nullable: true})
  type: string; // snippet or movedfile

  @ManyToOne(() => Thread, (t) => t.files)
  @JoinColumn({ name: "threadId" })
  thread: Promise<Thread>;
}