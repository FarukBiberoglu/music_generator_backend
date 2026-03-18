import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  let prisma: PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: { $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]) },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    prisma = app.get<PrismaService>(PrismaService);
  });

  describe('root', () => {
    it('returns { status: "ok" }', () => {
      expect(appController.root()).toEqual({ status: 'ok' });
    });
  });

  describe('getHealth', () => {
    it('returns { status: "ok" }', async () => {
      await expect(appController.getHealth()).resolves.toEqual({
        status: 'ok',
      });
    });
  });

  describe('getReady', () => {
    it('returns { status: "ok", database: "connected" } when DB is up', async () => {
      await expect(appController.getReady()).resolves.toEqual({
        status: 'ok',
        database: 'connected',
      });
    });

    it('throws when DB is down', async () => {
      jest
        .spyOn(prisma, '$queryRaw')
        .mockRejectedValueOnce(new Error('Connection refused'));
      await expect(appController.getReady()).rejects.toThrow();
    });
  });
});
