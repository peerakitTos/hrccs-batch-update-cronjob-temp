import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Employee } from "./employee.entity";

@Entity('identities')
export class Identity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  line_user_id: string


  @OneToOne(() => Employee, (employee: Employee) => employee.email, {
  })
  @JoinColumn({
    name: 'scg_email',
    referencedColumnName: 'email'
  })
  employee: Employee

  @Column()
  scg_email: string
  
  @CreateDateColumn({ nullable: true })
  created_at: Date;

  @Column({ nullable: true })
  created_by: number;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ nullable: true})
  active: boolean
}