// medico.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/users/entities/user.entity';

@ObjectType()
@Entity()
export class Medico {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Usuario, (usuario) => usuario.medico)
  @JoinColumn()
  usuario: Usuario;

  @Field()
  @Column()
  especialidad: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  direccion: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  telefono?: string;
}
