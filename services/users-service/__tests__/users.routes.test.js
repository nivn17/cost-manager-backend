const request = require("supertest");

jest.mock("../src/models/user", () => ({
    find: jest.fn(),
    findOne: jest.fn()
}));

jest.mock("../src/models/cost", () => ({
    aggregate: jest.fn()
}));

// logger writes logs on every request - prevent DB calls
jest.mock("../src/models/log", () => ({
    create: jest.fn()
}));

const User = require("../src/models/user");
const Cost = require("../src/models/cost");
const { app } = require("../src/app");

describe("users-service routes", () => {
    beforeEach(() => jest.clearAllMocks());

    test("GET /api/users - 200 returns list of users", async () => {
        User.find.mockResolvedValue([
            { id: 123123, first_name: "mosh", last_name: "israeli", birthday: "2000-01-01T00:00:00.000Z" }
        ]);

        const res = await request(app).get("/api/users");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty("id", 123123);
        expect(res.body[0]).toHaveProperty("first_name");
        expect(res.body[0]).toHaveProperty("last_name");
        expect(res.body[0]).toHaveProperty("birthday");
    });

    test("GET /api/users/:id - 200 returns user details + total costs", async () => {
        User.findOne.mockResolvedValue({
            id: 123123,
            first_name: "mosh",
            last_name: "israeli"
        });

        Cost.aggregate.mockResolvedValue([{ total: 42 }]);

        const res = await request(app).get("/api/users/123123");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            first_name: "mosh",
            last_name: "israeli",
            id: 123123,
            total: 42
        });
    });

    test("GET /api/users/:id - 404 when user not found", async () => {
        User.findOne.mockResolvedValue(null);

        const res = await request(app).get("/api/users/999");
        expect(res.statusCode).toBe(404);
        expect(res.body.id).toBe(4041);
    });

    test("GET /api/users/:id - 400 invalid user id", async () => {
        const res = await request(app).get("/api/users/abc");
        expect(res.statusCode).toBe(400);
        expect(res.body.id).toBe(4006);
    });
});
