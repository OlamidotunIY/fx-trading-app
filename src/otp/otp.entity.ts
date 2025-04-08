import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class OTP {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  code: string;

  @Column()
  expiresAt: Date;
}
