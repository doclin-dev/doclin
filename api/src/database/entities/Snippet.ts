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


  @ManyToOne(() => Thread, (t) => t.snippets, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "threadId" })
  thread: Thread;

  threadId: number;

  @OneToMany(() => SnippetFilePath, (sfp) => sfp.snippet, { cascade: true })
  snippetFilePaths: SnippetFilePath[];
}
