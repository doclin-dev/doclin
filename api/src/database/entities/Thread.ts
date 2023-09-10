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
import { Project } from "./Project";
import { Reply } from "./Reply";
import { Snippet } from "./Snippet";

@Entity()
export class Thread extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column("text")
  message: string;

  @Column({ nullable: true})
  userId: number;

  @ManyToOne(() => User, (user) => user.threads)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ nullable: true})
  projectId: number;

  @OneToMany(() => Snippet, (s) => s.thread, { cascade: true })
  snippets: Snippet[];

  @ManyToOne(() => Project, (project) => project.threads)
  @JoinColumn({ name: "projectId" })
  project: Project;

  @OneToMany(() => Reply, (reply) => reply.thread, { cascade: true })
  replies: Reply[];
}
