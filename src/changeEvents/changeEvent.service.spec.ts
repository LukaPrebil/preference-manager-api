import { HttpException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ObjectLiteral, Repository } from "typeorm";
import { User } from "../users/User.entity";
import { ChangeEvent } from "./ChangeEvent.entity";
import { ChangeEventService } from "./changeEvent.service";

type MockRepository<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe("ChangeEventService", () => {
  let service: ChangeEventService;
  let changeEventRepo: MockRepository<ChangeEvent>;
  let userRepo: MockRepository<User>;

  beforeEach(async () => {
    changeEventRepo = {
      save: jest.fn(),
      find: jest.fn(),
    };
    userRepo = {
      exists: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeEventService,
        { provide: getRepositoryToken(ChangeEvent), useValue: changeEventRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
      ],
    }).compile();

    service = module.get<ChangeEventService>(ChangeEventService);
  });

  describe("insertChangeEvent", () => {
    it("should throw an error if user does not exist", async () => {
      userRepo.exists?.mockResolvedValue(false);
      await expect(
        service.insertChangeEvent("123", "NOTIFICATION_PREFERENCE_CHANGE", {
          user: { id: "123" },
          consents: [{ id: "sms_notifications", enabled: true }],
        }),
      ).rejects.toThrow(HttpException);
    });

    it("should create and return a change event if user exists", async () => {
      userRepo.exists?.mockResolvedValue(true);
      const changeEvent = new ChangeEvent();
      changeEventRepo.save?.mockResolvedValue(changeEvent);

      await expect(
        service.insertChangeEvent("123", "NOTIFICATION_PREFERENCE_CHANGE", {
          user: { id: "123" },
          consents: [{ id: "sms_notifications", enabled: true }],
        }),
      ).resolves.toBe(changeEvent);
    });
  });

  describe("getEventsByUserId", () => {
    it("should return events for a given userId", async () => {
      const events = [new ChangeEvent(), new ChangeEvent()];
      changeEventRepo.find?.mockResolvedValue(events);

      await expect(service.getEventsByUserId("123")).resolves.toEqual(events);
    });
  });
});
