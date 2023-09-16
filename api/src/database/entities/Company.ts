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
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column("text")
  name: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User;

  @OneToMany(() => Project, (project) => project.company, { cascade: true })
  projects: Project[];
}
