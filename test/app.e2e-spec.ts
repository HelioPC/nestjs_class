import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get(PrismaService);

    await prisma.cleanDB();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Sign up', () => {
      it.todo('Should sign up');
    });

    describe('Sign in', () => {
      it.todo('Should sign in');
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it.todo('Should get user info');
    });

    describe('Edit me', () => {
      it.todo('Should edit user info');
    });

    describe('Change password', () => {
      it.todo('Should change user password');
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it.todo('Should create a bookmark');
    });

    describe('Get Bookmarks', () => {
      it.todo('Should get bookmarks');
    });

    describe('Edit bookmark', () => {
      it.todo('Should edit a bookmark');
    });

    describe('Get bookmark by id', () => {
      it.todo('Should get a bookmark by an id');
    });

    describe('Delete a bookmark', () => {
      it.todo('Should delete a bookmark');
    });
  });
});
