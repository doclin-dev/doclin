import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from "typeorm";
import { Company } from "./Company";
import { Thread } from "./Thread";


@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column("text")
  name: string;

  @Column("text")
  url: string;

  companyId: number;

  @ManyToOne(() => Company, (company) => company.projects)
  company: Company;

  @OneToMany(() => Thread, (thread) => thread.project)
  threads: Thread[];
}
