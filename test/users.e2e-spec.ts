import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from "supertest";
import { Repository } from "typeorm";
import { AppModule } from "../src/app.module";
import { ChangeEvent } from "../src/changeEvents/ChangeEvent.entity";
import { User } from "../src/users/User.entity";

describe("UsersController (E2E)", () => {
  let app: INestApplication;
  // let dataSource: DataSource;
  let userRepository: Repository<User>;
  let changeEventRepository: Repository<ChangeEvent>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Enable validation globally (mimics real app behavior)
    app.useGlobalPipes(new ValidationPipe());

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

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const response = await request(app.getHttpServer())
        .post("/users")
        .send({ email: "test@example.com" })
        .expect(201);

      expect(response.body).toMatchObject({ email: "test@example.com" });
    });

    it("should return 422 if user already exists", async () => {
      await request(app.getHttpServer()).post("/users").send({ email: "duplicate@example.com" });

      const response = await request(app.getHttpServer())
        .post("/users")
        .send({ email: "duplicate@example.com" })
        .expect(422);

      expect(response.body.message).toEqual("User already exists");
    });
  });

  describe("GET /users?id=:id", () => {
    it("should return a user by ID", async () => {
      const createdUser = await request(app.getHttpServer()).post("/users").send({ email: "user@example.com" });

      const userId = createdUser.body.id;

      const response = await request(app.getHttpServer()).get(`/users/id?id=${userId}`).expect(200);

      expect(response.body).toMatchObject({ id: userId, email: "user@example.com" });
    });

    it("should return 404 if user not found", async () => {
      const nonExistentUID = crypto.randomUUID();
      const response = await request(app.getHttpServer()).get(`/users/id?id=${nonExistentUID}`).expect(404);

      expect(response.body.message).toEqual("User not found");
    });
  });

  describe("GET /users?email=:email", () => {
    it("should return a user by email", async () => {
      await request(app.getHttpServer()).post("/users").send({ email: "lookup@example.com" });

      const response = await request(app.getHttpServer()).get("/users?email=lookup@example.com").expect(200);

      expect(response.body).toMatchObject({
        email: "lookup@example.com",
        consents: [
          { id: "email_notifications", enabled: false },
          { id: "sms_notifications", enabled: false },
        ],
      });
    });

    it("should return a user with latest consent state", async () => {
      const userEmail = "some@email.com";
      const response = await request(app.getHttpServer()).post("/users").send({ email: userEmail });

      // Update user's consent state
      await request(app.getHttpServer())
        .post("/events")
        .send({
          eventType: "NOTIFICATION_PREFERENCE_CHANGE",
          payload: { user: { id: response.body.id }, consents: [{ id: "email_notifications", enabled: true }] },
        });

      const updatedUser = await request(app.getHttpServer()).get(`/users?email=${userEmail}`);
      expect(updatedUser.body.consents).toEqual([
        { id: "email_notifications", enabled: true },
        { id: "sms_notifications", enabled: false },
      ]);
    });

    it("should return 404 if user is not found", async () => {
      await request(app.getHttpServer()).get("/users?email=notfound@example.com").expect(404);
    });
  });

  describe("DELETE /users", () => {
    it("should soft delete a user", async () => {
      const createdUser = await request(app.getHttpServer()).post("/users").send({ email: "delete@example.com" });

      const userId = createdUser.body.id;

      await request(app.getHttpServer()).delete("/users").send({ id: userId }).expect(200);

      // Check that the user no longer exists
      await request(app.getHttpServer()).get(`/users/id?id=${userId}`).expect(404);
    });

    it("should return 404 if user does not exist", async () => {
      const nonExistentUID = crypto.randomUUID();
      await request(app.getHttpServer()).delete("/users").send({ id: nonExistentUID }).expect(404);
    });
  });
});
