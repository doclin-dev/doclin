import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from "typeorm";
import { Reply } from "./Reply";

@Entity()
export class ReplySnippet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column("text")
  text: string;

  @ManyToOne(() => Reply, (reply) => reply.snippets, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "replyId" })
  reply: Reply;

  @Column({ type: "varchar", nullable: true })
  filePath: string | null;

  @Column({ type: "integer", nullable: true })
  lineStart: number | null;

  replyId: number;
}
