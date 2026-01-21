const request = require("supertest");

// ✅ mock models (paths include src because tests are in __tests__)
jest.mock("../src/models/cost", () => ({ create: jest.fn() }));
jest.mock("../src/models/user", () => ({ findOne: jest.fn() }));

// אם יש לך requestLogger שכותב ל-Log DB, זה ימנע נפילות:
jest.mock("../src/models/log", () => ({ create: jest.fn(), find: jest.fn() }));

const Cost = require("../src/models/cost");
const User = require("../src/models/user");
const { app } = require("../src/app");

function mockUserExists(exists) {
    // route calls: User.findOne(...).select(...)
    User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(exists ? { id: 123123 } : null)
    });
}

describe("costs-service: POST /api/add", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("201 - adds cost successfully (valid body, user exists, non-past date)", async () => {
        mockUserExists(true);

        const now = new Date(Date.now() + 60 * 1000); // 1 minute in future to avoid 'past' edge
        Cost.create.mockResolvedValue({
            description: "milk",
            category: "food",
            userid: 123123,
            sum: 8,
            date: now
        });

        const res = await request(app)
            .post("/api/add")
            .send({ userid: 123123, description: "milk", category: "food", sum: 8, date: now.toISOString() });

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            description: "milk",
            category: "food",
            userid: 123123,
            sum: 8,
            date: now.toISOString()
        });

        expect(User.findOne).toHaveBeenCalled();
        expect(Cost.create).toHaveBeenCalled();
    });

    test("400 - user does not exist", async () => {
        mockUserExists(false);

        const res = await request(app)
            .post("/api/add")
            .send({ userid: 999, description: "x", category: "food", sum: 1 });

        expect(res.statusCode).toBe(400);
        expect(res.body.id).toBe(4002);
        expect(Cost.create).not.toHaveBeenCalled();
    });

    test("400 - invalid category", async () => {
        mockUserExists(true);

        const res = await request(app)
            .post("/api/add")
            .send({ userid: 123123, description: "x", category: "invalid", sum: 1 });

        expect(res.statusCode).toBe(400);
        expect(res.body.id).toBe(4004);
        expect(Cost.create).not.toHaveBeenCalled();
    });

    test("400 - past dates are not allowed", async () => {
        mockUserExists(true);

        const past = new Date(Date.now() - 60 * 1000);
        const res = await request(app)
            .post("/api/add")
            .send({ userid: 123123, description: "x", category: "food", sum: 1, date: past.toISOString() });

        expect(res.statusCode).toBe(400);
        expect(res.body.id).toBe(4007);
        expect(Cost.create).not.toHaveBeenCalled();
    });
});
