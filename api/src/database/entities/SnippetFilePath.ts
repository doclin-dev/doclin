import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from "typeorm";
import { Snippet } from "./Snippet";

@Entity()
export class SnippetFilePath extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "varchar", nullable: true })
  filePath: string | null;

  @ManyToOne(() => Snippet, (s) => s.snippetFilePaths, { onDelete: 'CASCADE' })
  snippet: Snippet;

  @Column({ type: "integer", nullable: true })
  lineStart: number | null;

  snippetId: number;
}