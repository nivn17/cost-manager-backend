const request = require("supertest");

jest.mock("../src/models/cost", () => ({ aggregate: jest.fn() }));
jest.mock("../src/models/report", () => ({ findOne: jest.fn(), create: jest.fn() }));
jest.mock("../src/models/log", () => ({ create: jest.fn() }));

const Cost = require("../src/models/cost");
const Report = require("../src/models/report");
const { app } = require("../src/app");

describe("costs-service: GET /api/report", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("400 - invalid query params", async () => {
        const res = await request(app).get("/api/report?id=x&year=2026&month=1");
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("message");
    });

    test("200 - returns report skeleton when no costs", async () => {
        Cost.aggregate.mockResolvedValue([]);

        const res = await request(app).get("/api/report?id=123123&year=2099&month=1");

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("userid", 123123);
        expect(res.body).toHaveProperty("year", 2099);
        expect(res.body).toHaveProperty("month", 1);

        // skeleton has all categories
        expect(res.body.costs).toEqual([
            { food: [] },
            { education: [] },
            { health: [] },
            { housing: [] },
            { sports: [] }
        ]);
    });

    test("200 - uses computed cache for past month if exists", async () => {
        // Past month relative to now → pick 2000/1 as definitely past
        Report.findOne.mockResolvedValue({
            userid: 123123,
            year: 2000,
            month: 1,
            costs: [{ food: [{ sum: 1, description: "x", day: 1 }] }]
        });

        const res = await request(app).get("/api/report?id=123123&year=2000&month=1");

        expect(res.statusCode).toBe(200);
        expect(res.body.userid).toBe(123123);
        expect(res.body.year).toBe(2000);
        expect(res.body.month).toBe(1);
        expect(res.body.costs).toEqual([{ food: [{ sum: 1, description: "x", day: 1 }] }]);

        expect(Cost.aggregate).not.toHaveBeenCalled();
    });
});
