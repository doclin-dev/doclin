import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
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

  @Column()
  snippetId: number;

  @ManyToOne(() => Snippet, (s) => s.snippetFilePaths, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "snippetId" })
  snippet: Promise<Snippet>;
}