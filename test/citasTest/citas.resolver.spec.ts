import { Test, TestingModule } from '@nestjs/testing';
import { CitasResolver } from './citas.resolver';
import { CitasService } from './citas.service';

describe('CitasResolver', () => {
  let resolver: CitasResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CitasResolver, CitasService],
    }).compile();

    resolver = module.get<CitasResolver>(CitasResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
