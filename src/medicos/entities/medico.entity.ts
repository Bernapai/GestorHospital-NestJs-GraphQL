import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from 'src/users/entities/user.entity';
import { Cita } from '../../citas/entities/cita.entity';

@ObjectType({ description: 'Representa un médico asociado a un usuario' })
@Entity()
export class Medico {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Usuario)
  @OneToOne(() => Usuario, (usuario) => usuario.medico)
  @JoinColumn()
  usuario: Usuario;

  @Field()
  @Column()
  especialidad: string;

  // AÑADIR @Field A CITAS!
  @Field(() => [Cita], { nullable: true })
  @OneToMany(() => Cita, (cita) => cita.medico)
  citas: Cita[];

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