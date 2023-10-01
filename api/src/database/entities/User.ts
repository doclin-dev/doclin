import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from "typeorm";
import { Thread } from "./Thread";
import { Reply } from "./Reply";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column("text", { nullable: true })
  name: string;

  @Column("text", { unique: true })
  githubId: string;

  @OneToMany(() => Thread, (thread) => thread.user)
  threads: Thread[];

  @OneToMany(() => Reply, (t) => t.user)
  replies: Reply[];
}
