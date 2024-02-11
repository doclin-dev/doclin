import {
	BaseEntity,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	CreateDateColumn
} from "typeorm";
import { Thread } from "./Thread";

@Entity()
export class ThreadSnippet extends BaseEntity {
    @PrimaryGeneratedColumn()
  	id: number;

    @CreateDateColumn()
  	createdAt: Date;

    @Column("text")
  	text: string;

    @ManyToOne(() => Thread, (t) => t.snippets, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: "threadId" })
  	thread: Thread;

    @Column({ type: "varchar", nullable: true })
  	filePath: string | null;

    @Column({ type: "integer", nullable: true })
  	lineStart: number | null;

    threadId: number;

    @Column({ length: 150, nullable: true })
  	gitBranch: string;
}
