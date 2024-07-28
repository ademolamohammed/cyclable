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
import { hashPassword } from '../user.utils';

  
  @Entity('users')
  @Index(['dialcode', 'phoneNumber', 'deletedAt'], { unique: true })
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
  
    @Column()
    firstName: string;
  
    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    dialcode: string;
  
    @Column({ unique: true })
    phoneNumber: string;
  
    @Column({ default: false })
    phoneNumberConfirmed: boolean;
  
    @Column({ unique: true })
    email: string;
  
    @Column({ default: false })
    emailConfirmed: boolean;
  
    @Column({ nullable: true })
    password: string;
  
    @Column({ nullable: true })
    address: string;
  
    @Column({ nullable: true })
    province: string;
  
    @Column({ nullable: true })
    city: string;
  
  
    @Column({ default: false })
    twoFactorEnabled: boolean;

  
    @Column({ default: false })
    enabled: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn({ nullable: true })
    deletedAt: Date;
  
  
    @Column({ nullable: true })
    resetPasswordToken: string;
  
    @Column({ nullable: true })
    resetPasswordExpire: Date;
  
    @Column({ nullable: true, select: false })
    signupToken: string;
  
    @Column({ nullable: true, select: false })
    loginToken: string;
  
    @Column({ nullable: true, select: false })
    loginOTP: string;
  
    @Column({ nullable: true, select: false })
    loginOTPExpire: Date;
  
    @Column({ nullable: true, select: false })
    phoneOTP: string;
  
    @Column({ nullable: true, select: false })
    phoneOTPExpire: Date;
  
    @BeforeInsert()
    async setPassword(password: string) {
      if (password || this.password) {
        this.password = await hashPassword(password || this.password);
      }
    }

  }
  