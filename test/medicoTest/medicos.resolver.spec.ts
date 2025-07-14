import { Test, TestingModule } from '@nestjs/testing';
import { MedicosResolver } from './medicos.resolver';
import { MedicosService } from './medicos.service';

describe('MedicosResolver', () => {
  let resolver: MedicosResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicosResolver, MedicosService],
    }).compile();

    resolver = module.get<MedicosResolver>(MedicosResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
