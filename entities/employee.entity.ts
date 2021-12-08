import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Identity } from "./identity.entity";

@Entity("employees")
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  person_id: string;

  @Column({ nullable: true })
  personnel_number: string;

  @Column({ nullable: true })
  scg_employee_id: string;

  @Column({ nullable: true })
  name_prefix_th: string;

  @Column({ nullable: true })
  first_name_th: string;

  @Column({ nullable: true })
  last_name_th: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  position_name_th: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  business_unit: string;

  @Column({ nullable: true })
  division: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  employment_status: string;

  @Column({ nullable: true })
  contract_type: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true, unique: true})
  email: string;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  updated_by: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  created_by: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  pl: string;

  @Column({ nullable: true })
  scg_pl: string;

  @Column({ nullable: true })
  sub1_shift_th: string;

  @Column({ nullable: true })
  shift_th: string;
  
  @Column({ nullable: true })
  sub1_section_th: string;

  @Column({ nullable: true })
  section_th: string;

  @Column({ nullable: true })
  sub1_department_th: string;

  @Column({ nullable: true })
  sub1_division_th: string;
  
  @Column({ nullable: true })
  sub1_company_th: string;

  @Column({ nullable: true })
  sub1_1_business_unit_th: string;

  @Column({ nullable: true })
  business_unit_desc_th: string;

  @OneToOne(() => Identity, (identity: Identity) => identity.scg_email, {
  })
  identity: Identity
}
