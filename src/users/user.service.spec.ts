import { HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ObjectLiteral, Repository } from "typeorm";
import { User } from "./User.entity";
import { UserService } from "./user.service";

type MockRepository<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe("UserService", () => {
  let service: UserService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    userRepository = {
      findOne: jest.fn(),
      exists: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: getRepositoryToken(User), useValue: userRepository }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe("getUserById", () => {
    it("should return a user DTO if found", async () => {
      const user = new User();
      user.toDTO = jest.fn().mockReturnValue({ id: "123" });
      userRepository.findOne?.mockResolvedValue(user);

      await expect(service.getUserById("123")).resolves.toEqual({ id: "123" });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if user is not found", async () => {
      userRepository.findOne?.mockResolvedValue(null);
      await expect(service.getUserById("123")).rejects.toThrow(HttpException);
    });
  });

  describe("getUserByEmail", () => {
    it("should return a user DTO if found", async () => {
      const user = new User();
      user.toDTO = jest.fn().mockReturnValue({ email: "test@example.com" });
      userRepository.findOne?.mockResolvedValue(user);

      await expect(service.getUserByEmail("test@example.com")).resolves.toEqual({ email: "test@example.com" });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe("createUser", () => {
    it("should throw an error if user already exists", async () => {
      userRepository.exists?.mockResolvedValue(true);
      await expect(service.createUser("test@example.com")).rejects.toThrow(HttpException);
    });

    it("should create a new user if none exists", async () => {
      userRepository.exists?.mockResolvedValue(false);
      userRepository.findOne?.mockResolvedValue(null);

      const user = new User();
      user.toDTO = jest.fn().mockReturnValue({ email: "test@example.com" });
      userRepository.save?.mockResolvedValue(user);

      await expect(service.createUser("test@example.com")).resolves.toEqual({ email: "test@example.com" });
    });

    it("should restore a deleted user if found", async () => {
      userRepository.exists?.mockResolvedValue(false);
      const deletedUser = new User();
      deletedUser.toDTO = jest.fn().mockReturnValue({ email: "hashedEmail" });
      userRepository.findOne?.mockResolvedValue(deletedUser);

      const user = new User();
      user.toDTO = jest.fn().mockReturnValue({ email: "example@email.com" });
      userRepository.save?.mockResolvedValue(user);

      await expect(service.createUser("email@example.com")).resolves.toEqual({ email: "example@email.com" });
      expect(userRepository.save).toHaveBeenCalledWith({
        ...deletedUser,
        email: "email@example.com",
        deletedAt: undefined,
      });
    });
  });

  describe("softDeleteUser", () => {
    it("should soft delete a user if found", async () => {
      const user = new User();
      user.hashEmail = jest.fn().mockReturnValue("hashedEmail");
      userRepository.findOne?.mockResolvedValue(user);
      userRepository.update?.mockResolvedValue(undefined);

      await expect(service.softDeleteUser("123")).resolves.toBe("123");
    });

    it("should throw an error if user is not found", async () => {
      userRepository.findOne?.mockResolvedValue(null);
      await expect(service.softDeleteUser("123")).rejects.toThrow(HttpException);
    });
  });
});
