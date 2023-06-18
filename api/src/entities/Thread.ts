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

@Entity()
export class Thread extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { unique: true })
  message: string;

  @Column({ nullable: true})
  userId: number;

  @ManyToOne(() => User, (u) => u.threads)
  @JoinColumn({ name: "userId" })
  user: Promise<User>;

  @Column({ nullable: true})
  projectId: number;

  @ManyToOne(() => Project, (p) => p.threads)
  @JoinColumn({ name: "projectId" })
  project: Promise<Project>;

  @OneToMany(() => Comment, (c) => c.threadId)
  comments: Promise<Comment[]>;
}
