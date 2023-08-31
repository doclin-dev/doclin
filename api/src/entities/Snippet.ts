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
import { Thread } from "./Thread";
import { SnippetFilePath } from "./SnippetFilePath";

@Entity()
export class Snippet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column("text")
  text: string;

  @Column({ nullable: true})
  threadId: number;

  @ManyToOne(() => Thread, (t) => t.snippets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "threadId" })
  thread: Promise<Thread>;

  @OneToMany(() => SnippetFilePath, (sfp) => sfp.snippet, { cascade: true })
  snippetFilePaths: Promise<SnippetFilePath[]>;
}
