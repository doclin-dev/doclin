import { LogType } from "../../types/enums";
import {
    BaseEntity,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn
  } from "typeorm";

  @Entity()
  export class Log extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @Column()
    type: LogType

    @Column("text")
    message: string;

    @Column({ nullable: true })
    userId: number;
}
  