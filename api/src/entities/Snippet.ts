import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Thread } from "./Thread";
import { SnippetFilePath } from "./SnippetFilePath";

@Entity()
export class Snippet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  text: string;

  @Column({ nullable: true})
  threadId: number;

  @ManyToOne(() => Thread, (t) => t.snippets)
  @JoinColumn({ name: "threadId" })
  thread: Promise<Thread>;

  @OneToMany(() => SnippetFilePath, (sfp) => sfp.snippet)
  snippetFilePaths: Promise<SnippetFilePath[]>;
}
