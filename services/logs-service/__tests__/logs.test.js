const request = require("supertest");

jest.mock("../src/models/log", () => ({ find: jest.fn(), create: jest.fn() }));

const Log = require("../src/models/log");
const { app } = require("../src/app");

describe("logs-service: GET /api/logs", () => {
    beforeEach(() => jest.clearAllMocks());

    test("200 - returns logs list", async () => {
        Log.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue([{ level: "info", msg: "x" }])
        });

        const res = await request(app).get("/api/logs");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty("level", "info");
    });
});
