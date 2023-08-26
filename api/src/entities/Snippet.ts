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
import { Thread } from "./Thread";
import { SnippetFilePath } from "./SnippetFilePath";

@Entity()
export class Snippet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  text: string;

  @ManyToOne(() => User, (u) => u.threads)
  @JoinColumn({ name: "userId" })
  user: Promise<User>;

  @Column({ nullable: true})
  projectId: number;

  @OneToMany(() => SnippetFilePath, (sfp) => sfp.snippet)
  snippetFilePaths: Promise<SnippetFilePath[]>;

  @ManyToOne(() => Thread, (t) => t.snippets)
  @JoinColumn({ name: "threadId" })
  thread: Promise<Thread>;
}
