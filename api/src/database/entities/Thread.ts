import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Project } from './Project';
import { Reply } from './Reply';
import { ThreadSnippet } from './ThreadSnippet';

@Entity()
export class Thread extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column('text')
  message: string;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.threads)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  projectId: number;

  @Column({ nullable: true })
  anonymous: boolean;

  @OneToMany(() => ThreadSnippet, (s) => s.thread, { cascade: true })
  snippets: ThreadSnippet[];

  @ManyToOne(() => Project, (project) => project.threads)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @OneToMany(() => Reply, (reply) => reply.thread, { cascade: true })
  replies: Reply[];

  replyCount: number;

  @Column({ type: 'json', nullable: true })
  delta: any;

  @Column({ type: 'text', nullable: true })
  filePath: string;

  @Column({ type: 'text', nullable: true })
  gitBranch: string;

  @Column('double precision', { array: true, nullable: true })
  embedding: number[];
}
