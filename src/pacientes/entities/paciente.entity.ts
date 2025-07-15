// paciente.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/users/entities/user.entity';

@ObjectType()
@Entity()
export class Paciente {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario, (usuario) => usuario.paciente)
  @JoinColumn()
  usuario: Usuario;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  dni: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fechaNacimiento?: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  telefono?: string;
}
