

import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
  } from 'typeorm';
  import {
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';

  
  @Entity('bookings')
  @Index(['email'], { unique: true })
  export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
  
    @Column()
    firstName: string;
  
    @Column({ nullable: true })
    lastName: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ default: false })
    emailConfirmed: boolean;
  
  
    @Column({ nullable: true })
    address: string;
  
    @Column({ nullable: true })
    type: string;
  
    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    date: Date;
  
  
    @Column({ default: false })
    twoFactorEnabled: boolean;

  

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
  

  }