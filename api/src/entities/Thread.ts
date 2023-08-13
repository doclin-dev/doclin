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
import { Project } from "./Project";
import { Comment } from "./Comment";
import { ThreadFile } from "./ThreadFile";

@Entity()
export class Thread extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  message: string;

  @Column({ nullable: true})
  userId: number;

  @ManyToOne(() => User, (u) => u.threads)
  @JoinColumn({ name: "userId" })
  user: Promise<User>;

  @Column({ nullable: true})
  projectId: number;

  @OneToMany(() => ThreadFile, (tf) => tf.thread)
  threadFiles: Promise<ThreadFile[]>;

  @ManyToOne(() => Project, (p) => p.threads)
  @JoinColumn({ name: "projectId" })
  project: Promise<Project>;

  @OneToMany(() => Comment, (c) => c.thread)
  comments: Promise<Comment[]>;
}
