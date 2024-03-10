import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { Faker, en, pt_PT } from '@faker-js/faker';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDTO, LoginDTO } from '../src/auth/dto';
import { EditUserDTO } from 'src/user/dto';
import { ChangePasswordDTO } from 'src/user/dto/change.password.dto';
import { CreateBookmarkDto, UpdateBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const faker = new Faker({ locale: [pt_PT, en] });
  const userPassword = faker.internet.password();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);

    await prisma.cleanDB();

    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDTO = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: userPassword,
    };

    describe('Sign up', () => {
      const endpoint = '/auth/signup';

      it('Should throw error if email empty', () => {
        const dtoCopy = { ...dto };

        delete dtoCopy.email;

        return pactum.spec().post(endpoint).withBody(dtoCopy).expectStatus(400);
      });

      it('Should throw error if password empty', () => {
        const dtoCopy = { ...dto };

        delete dtoCopy.password;

        return pactum.spec().post(endpoint).withBody(dtoCopy).expectStatus(400);
      });

      it('Should throw error if body empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('Should register a user', () => {
        return pactum.spec().post(endpoint).withBody(dto).expectStatus(201);
      });
    });

    describe('Sign in', () => {
      const endpoint = '/auth/signin';
      const loginDTO: LoginDTO = {
        email: dto.email,
        password: dto.password,
      };

      it('Should throw error if email empty', () => {
        const dtoCopy = { ...loginDTO };

        delete dtoCopy.email;

        return pactum.spec().post(endpoint).withBody(dtoCopy).expectStatus(400);
      });

      it('Should throw error if password empty', () => {
        const dtoCopy = { ...loginDTO };

        delete dtoCopy.password;

        return pactum.spec().post(endpoint).withBody(dtoCopy).expectStatus(400);
      });

      it('Should throw error if body empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('Should login a user', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody(loginDTO)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('Bookmarks', () => {
    const endpoint = '/bookmarks';

    describe('Get empty Bookmarks', () => {
      it("Shouldn't get bookmarks", () => {
        return pactum
          .spec()
          .get(endpoint)
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: faker.word.noun({
          length: { min: 4, max: 10 },
          strategy: 'fail',
        }),
        description: faker.lorem.lines(2),
        link: faker.internet.url(),
      };

      it('Should create a bookmark', () => {
        return pactum
          .spec()
          .post(endpoint)
          .withBody(dto)
          .withBearerToken('$S{userAt}')
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get Bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum
          .spec()
          .get(endpoint)
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Edit bookmark', () => {
      const dto: UpdateBookmarkDto = {
        title: faker.word.noun({
          length: { min: 4, max: 10 },
          strategy: 'fail',
        }),
        description: faker.lorem.lines(2),
        link: faker.internet.url(),
      };

      it('Should edit a bookmark', () => {
        return pactum
          .spec()
          .patch(`${endpoint}/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Get bookmark by id', () => {
      it('Should get a bookmark by an id', () => {
        return pactum
          .spec()
          .patch(`${endpoint}/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Delete a bookmark', () => {
      it('Should delete a bookmark', () => {
        return pactum
          .spec()
          .delete(`${endpoint}/{id}`)
          .withPathParams('id', '$S{bookmarkId}')
          .withBearerToken('$S{userAt}')
          .expectStatus(204);
      });
    });

    describe('Get empty Bookmarks', () => {
      it("Shouldn't get bookmarks", () => {
        return pactum
          .spec()
          .get(endpoint)
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });

  describe('User info', () => {
    const endpoint = '/users';

    describe('Get me', () => {
      it('Should get user info', () => {
        return pactum
          .spec()
          .get(`${endpoint}/me`)
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
    });

    describe('Change password', () => {
      it('Should change user password', () => {
        const dto: ChangePasswordDTO = {
          currentPassword: userPassword,
          newPassword: faker.internet.password(),
        };

        return pactum
          .spec()
          .patch(`${endpoint}/change-password`)
          .withBody(dto)
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
    });

    describe('Edit me', () => {
      it('Should edit user info', () => {
        const dto: EditUserDTO = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
        };

        return pactum
          .spec()
          .patch(`${endpoint}/me`)
          .withBody(dto)
          .withBearerToken('$S{userAt}')
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
          .expectBodyContains(dto.email);
      });
    });
  });
});
