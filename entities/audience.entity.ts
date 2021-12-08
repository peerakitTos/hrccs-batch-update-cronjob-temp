import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("audiences")
export class Audience extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false
  })
  description: string

  @Column({nullable: false})
  audience_id: string

  @Column({
    nullable: false, default: 0
  })
  audience_count: number

  @Column({nullable: true})
  audience_status: string
  
  @Column({
    type:'json',
    nullable: true
  })
  audiences: {
    id: string
  }[]

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: false })
  created_by: number;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: false })
  updated_by: number;

  @DeleteDateColumn()
  deleted_at: Date

}