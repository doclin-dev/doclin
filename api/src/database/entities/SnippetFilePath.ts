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

  @Column()
  filePath: string;

  @ManyToOne(() => Snippet, (s) => s.snippetFilePaths, { onDelete: 'CASCADE' })
  snippet: Snippet;

  @Column({
    nullable: true
  })
  lineStart: number;

  snippetId: number;
}