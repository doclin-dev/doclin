import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	OneToMany
} from "typeorm";
import { User } from "./User";
import { Thread } from "./Thread";
import { ReplySnippet } from "./ReplySnippet";

@Entity()
export class Reply extends BaseEntity {
  @PrimaryGeneratedColumn()
  	id: number;

  @Column("text")
  	message: string;

  @Column({ nullable: true })
  	userId: number;

  @Column()
  	threadId: number;

  @Column({ nullable: true })
  	anonymous: boolean;

  @ManyToOne(() => User, (user) => user.replies)
  @JoinColumn({ name: "userId" })
  	user: User;

  @CreateDateColumn()
  	createdAt: Date;

  @ManyToOne(() => Thread, (thread) => thread.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "threadId" })
  	thread: Thread;

  @OneToMany(() => ReplySnippet, (snippet) => snippet.reply, { cascade: true })
  	snippets: ReplySnippet[];

  @Column({ type: 'json', nullable: true })
  	delta: any;
}
