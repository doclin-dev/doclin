import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Snippet } from "./Snippet";

@Entity()
export class SnippetFilePath extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filePath: string;

  @Column()
  threadId: number;

  @Column({nullable: true})
  type: string; // "snippet" or "movedfile"

  @ManyToOne(() => Snippet, (s) => s.snippetFilePaths)
  @JoinColumn({ name: "snippetId" })
  snippet: Promise<Snippet>;
}