import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from "typeorm";
import { User } from "./User";
import { Project } from "./Project";

@Entity()
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column("text")
  name: string;

  @ManyToMany(() => User, user => user.organizations, { cascade: true })
  @JoinTable()
  users: User[];

  @OneToMany(() => Project, (project) => project.organization, { cascade: true })
  projects: Project[];
}
