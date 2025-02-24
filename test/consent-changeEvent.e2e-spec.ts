import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from "supertest";
import { Repository } from "typeorm";
import { AppModule } from "../src/app.module";
import { ChangeEvent } from "../src/changeEvents/ChangeEvent.entity";
import { CreateChangeEventDto } from "../src/changeEvents/createEvent.dto";
import { User } from "../src/users/User.entity";

describe("ChangeEventController (e2e)", () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let changeEventRepository: Repository<ChangeEvent>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    changeEventRepository = moduleFixture.get<Repository<ChangeEvent>>(getRepositoryToken(ChangeEvent));
  });

  beforeEach(async () => {
    await changeEventRepository.query(`TRUNCATE TABLE "change_event" RESTART IDENTITY CASCADE;`);
    await userRepository.query(`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /events", () => {
    it("should create a new change event", async () => {
      // Arrange: Create a test user
      const testUser = userRepository.create({ email: "test@example.com" });
      await userRepository.save(testUser);

      const data: CreateChangeEventDto = {
        eventType: "NOTIFICATION_PREFERENCE_CHANGE",
        payload: {
          user: { id: testUser.id },
          consents: [
            { id: "email_notifications", enabled: true },
            { id: "sms_notifications", enabled: false },
          ],
        },
      };

      // Act: Send the request
      const response = await request(app.getHttpServer()).post("/events").send(data);

      // Assert: Check response
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.user.id).toBe(testUser.id);
      expect(response.body.event_type).toBe(data.eventType);
      expect(response.body.payload).toEqual(data.payload);
    });

    it("should return 404 if user does not exist", async () => {
      const randomUID = crypto.randomUUID();
      const data: CreateChangeEventDto = {
        eventType: "NOTIFICATION_PREFERENCE_CHANGE",
        payload: {
          user: { id: randomUID },
          consents: [
            { id: "email_notifications", enabled: true },
            { id: "sms_notifications", enabled: false },
          ],
        },
      };

      const response = await request(app.getHttpServer()).post("/events").send(data);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain(`User with id ${randomUID} does not exist`);
    });
  });
});
