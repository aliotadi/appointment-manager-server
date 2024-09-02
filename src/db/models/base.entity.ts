import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'boolean', default: true })
    isActive: boolean;
  
    @Column({ type: 'boolean', default: false })
    isArchived: boolean;
  
    @Column({ nullable: true })
    createdBy: number;
  
    @Column({ nullable: true })
    lastChangedBy: number;
  
    @Column({ nullable: true })
    deletedBy: number;
  
    @Column({ type: 'text', nullable: true })
    internalComment: string | null;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;
  }
  