import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany
} from "typeorm";
import { Thread } from "./Thread";
import { Reply } from "./Reply";
import { Organization } from "./Organization";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column("text", { nullable: false })
  name: string;

  @Column("text", { unique: false })
  githubId: string;

  @Column("text", { nullable: false })
  email: string;

  @OneToMany(() => Thread, (thread) => thread.user)
  threads: Thread[];

  @OneToMany(() => Reply, (t) => t.user)
  replies: Reply[];

  @ManyToMany(() => Organization, organization => organization.users)
  organizations: Organization[];
}
