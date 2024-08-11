import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Organization } from './Organization';
import { Thread } from './Thread';

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column('text')
  name: string;

  @Column()
  organizationId: string;

  @Column({ type: 'boolean', default: true })
  privateProject: boolean;

  @ManyToOne(() => Organization, (organization) => organization.projects)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @OneToMany(() => Thread, (thread) => thread.project)
  threads: Thread[];
}
