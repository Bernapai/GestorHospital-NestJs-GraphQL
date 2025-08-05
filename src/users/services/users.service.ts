import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/user.entity';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // Agregué 'private' aquí
  ) { }

  async create(createUsuarioDto: CreateUserInput): Promise<Usuario> {
    this.logger.log(`Creating user: ${createUsuarioDto.email}`);

    try {
      const usuario = this.usuarioRepository.create(createUsuarioDto);
      const result = await this.usuarioRepository.save(usuario);

      // Limpiar cache
      await this.invalidateCache(['users:all', 'users:stats']);

      this.logger.log(`User created: ID ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Usuario[]> {
    return this.getFromCache(
      'users:all',
      async () => {
        this.logger.log('Fetching all users from database');
        return this.usuarioRepository.find({
          relations: ['medico', 'paciente']
        });
      },
      300
    );
  }

  async findOne(id: number): Promise<Usuario> {
    return this.getFromCache(
      `user:${id}`,
      async () => {
        this.logger.log(`Fetching user from database: ${id}`);
        const usuario = await this.usuarioRepository.findOne({
          where: { id },
          relations: ['medico', 'paciente']
        });

        if (!usuario) {
          throw new NotFoundException(`Usuario con id ${id} no encontrado`);
        }

        return usuario;
      },
      600
    );
  }

  async findByEmail(email: string): Promise<Usuario> {
    return this.getFromCache(
      `user:email:${email}`,
      async () => {
        this.logger.log(`Fetching user by email from database: ${email}`);
        const usuario = await this.usuarioRepository.findOne({
          where: { email },
          relations: ['medico', 'paciente']
        });

        if (!usuario) {
          throw new NotFoundException(`Usuario con email ${email} no encontrado`);
        }

        return usuario;
      },
      600
    );
  }

  async update(id: number, updateUsuarioDto: UpdateUserInput): Promise<Usuario> {
    this.logger.log(`Updating user: ${id}`);

    try {
      const usuario = await this.usuarioRepository.preload({
        id,
        ...updateUsuarioDto,
      });

      if (!usuario) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }

      const result = await this.usuarioRepository.save(usuario);

      // Limpiar cache relacionado
      await this.invalidateCache([
        `user:${id}`,
        `user:email:${result.email}`,
        'users:all',
        'users:stats'
      ]);

      this.logger.log(`User updated: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error updating user ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<Usuario> {
    this.logger.log(`Removing user: ${id}`);

    try {
      const usuario = await this.usuarioRepository.findOneBy({ id });

      if (!usuario) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }

      const result = await this.usuarioRepository.remove(usuario);

      // Limpiar cache
      await this.invalidateCache([
        `user:${id}`,
        `user:email:${usuario.email}`,
        'users:all',
        'users:stats'
      ]);

      this.logger.log(`User removed: ${id}`);
      return { ...result, id }; // Restaurar ID para respuesta
    } catch (error) {
      this.logger.error(`Error removing user ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  // Metodos adicionales
  private async getFromCache<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl: number = 300
  ): Promise<T> {
    try {
      // Intentar obtener del cache
      const cached = await this.cacheManager.get<T>(key);

      if (cached) {
        this.logger.debug(`Cache hit for key: ${key}`);
        return cached;
      }

      this.logger.debug(`Cache miss for key: ${key}`);

      // No está en cache, ejecutar función y guardar resultado
      const result = await fetchFunction();

      // Guardar en cache
      await this.cacheManager.set(key, result, ttl);

      return result;
    } catch (error) {
      this.logger.error(`Cache error for key ${key}: ${error.message}`);
      // Si hay error con cache, ejecutar función directamente
      return fetchFunction();
    }
  }

  private async invalidateCache(keys: string[]): Promise<void> {
    try {
      const promises = keys.map(key => this.cacheManager.del(key));
      await Promise.all(promises);
      this.logger.debug(`Cache invalidated for keys: ${keys.join(', ')}`);
    } catch (error) {
      this.logger.error(`Error invalidating cache: ${error.message}`);
    }
  }

}