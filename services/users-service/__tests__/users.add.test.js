const request = require("supertest");

jest.mock("../src/models/user", () => ({ create: jest.fn(), find: jest.fn(), findOne: jest.fn() }));
jest.mock("../src/models/cost", () => ({ aggregate: jest.fn() }));
jest.mock("../src/models/log", () => ({ create: jest.fn() }));

const User = require("../src/models/user");
const { app } = require("../src/app");

describe("users-service: POST /api/add", () => {
    beforeEach(() => jest.clearAllMocks());

    test("201 - adds user successfully", async () => {
        const birthday = new Date("2000-01-01");
        User.create.mockResolvedValue({
            id: 123123,
            first_name: "mosh",
            last_name: "israeli",
            birthday
        });

        const res = await request(app)
            .post("/api/add")
            .send({ id: 123123, first_name: "mosh", last_name: "israeli", birthday: "2000-01-01" });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            id: 123123,
            first_name: "mosh",
            last_name: "israeli",
            birthday: birthday.toISOString()
        });
    });

    test("400 - invalid id", async () => {
        const res = await request(app)
            .post("/api/add")
            .send({ id: "abc", first_name: "a", last_name: "b", birthday: "2000-01-01" });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("message");
        expect(User.create).not.toHaveBeenCalled();
    });
});
