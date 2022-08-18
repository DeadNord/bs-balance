import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/Post CreateTrans', () => {
    it('Create Trans for New User with Minus Sum', async () => {
      const createTransDto = {
        id: 'adeeeerrse',
        sum: -10,
      };

      await request(app.getHttpServer())
        .post(`/balance`)
        .send(createTransDto)
        .expect(400);
    });

    it('Create Trans fro exsist User with too little amount sum', async () => {
      const createTransDto = {
        id: 'TTESST2',
        sum: -1000,
      };

      await request(app.getHttpServer())
        .post(`/balance`)
        .send(createTransDto)
        .expect(400);
    });

    it('Create Trans', async () => {
      const createTransDto = {
        id: 'TTESST2',
        sum: 10,
      };

      const res = {
        from: 'BeSocial',
        to: createTransDto.id,
        value: createTransDto.sum,
      };

      await request(app.getHttpServer())
        .post(`/balance`)
        .send(createTransDto)
        .expect(201)
        .expect(res);
    });
  });

  describe('/Post CreateC2CTrans', () => {
    it('CreateC2CTrans for New User with Minus Sum', async () => {
      const createC2CTransDto = {
        from: 'andj283wofj3ff53',
        id: 'adeeeerrse',
        sum: -10,
      };

      await request(app.getHttpServer())
        .post(`/balance/c2c`)
        .send(createC2CTransDto)
        .expect(400);
    });

    it('CreateC2CTrans fro exsist User with too little amount sum', async () => {
      const createC2CTransDto = {
        from: 'andj283wofj3ff53',
        id: 'TTESST2',
        sum: -1000,
      };

      await request(app.getHttpServer())
        .post(`/balance/c2c`)
        .send(createC2CTransDto)
        .expect(400);
    });

    it('CreateC2CTrans', async () => {
      const createC2CTransDto = {
        from: 'andj283wofj3ff53',
        id: 'TTESST2',
        sum: 10,
      };

      const res = {
        from: createC2CTransDto.from,
        to: createC2CTransDto.id,
        value: createC2CTransDto.sum,
      };

      await request(app.getHttpServer())
        .post(`/balance/c2c`)
        .send(createC2CTransDto)
        .expect(201)
        .expect(res);
    });
  });

  describe('/Get User Balance', () => {
    it('Uncorrect User', async () => {
      const req = {
        id: 'aee2222',
      };

      await request(app.getHttpServer())
        .get(`/balance/user-balance/${req.id}`)
        .expect(404);
    });

    it('Correct Data with uncorrect currency', async () => {
      const req = {
        id: '4b75j546j4976j4',
        currency: 'ERR',
      };

      await request(app.getHttpServer())
        .get(`/balance/user-balance/${req.id}?currency=${req.currency}`)
        .expect(400);
    });

    it('Correct Data without currency', async () => {
      const req = {
        id: '4b75j546j4976j4',
      };
      const res = {
        id: req.id,
        balance: 15,
        currency: 'USD',
      };
      await request(app.getHttpServer())
        .get(`/balance/user-balance/${req.id}`)
        .expect(200)
        .expect(res);
    });

    it('Correct Data with correct currency', async () => {
      const req = {
        id: '4b75j546j4976j4',
        currency: 'EUR',
      };
      const res = {
        id: req.id,
        balance: 14.757975,
        currency: 'EUR',
      };
      await request(app.getHttpServer())
        .get(`/balance/user-balance/${req.id}?currency=${req.currency}`)
        .expect(200)
        .expect(res);
    });
  });

  describe('/Get User Trans', () => {
    it('Uncorrect User', async () => {
      const req = {
        id: 'aee2222',
      };

      await request(app.getHttpServer())
        .get(`/balance/transactions/${req.id}`)
        .expect(404);
    });

    it('Correct Data ', async () => {
      const req = {
        id: '4b75j546j4976j4',
      };

      const resp = {
        pagin: 10,
      };

      await request(app.getHttpServer())
        .get(`/balance/transactions/${req.id}`)
        .expect(200)
        .then(res => {
          expect(res.body).toHaveLength(resp.pagin);
        });
    });

    it('Check Pagin', async () => {
      const req = {
        id: '4b75j546j4976j4',
        pamas: {
          page: 1,
          limit: 2,
        },
      };

      await request(app.getHttpServer())
        .get(
          `/balance/transactions/${req.id}?page=${req.pamas.page}&limit=${req.pamas.limit}`,
        )
        .expect(200)
        .then(res => {
          expect(res.body).toHaveLength(req.pamas.limit);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
