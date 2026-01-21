const request = require("supertest");

jest.mock("../src/models/log", () => ({ create: jest.fn() }));

const { app } = require("../src/app");

describe("about-service: GET /api/about", () => {
    test("200 - returns team members with first_name and last_name only", async () => {
        process.env.TEAM_MEMBER_1_FIRST = "Vlad";
        process.env.TEAM_MEMBER_1_LAST = "Beilin";
        process.env.TEAM_MEMBER_2_FIRST = "Niv";
        process.env.TEAM_MEMBER_2_LAST = "Nahum";

        const res = await request(app).get("/api/about");
        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual([
            { first_name: "Vlad", last_name: "Beilin" },
            { first_name: "Niv", last_name: "Nahum" }
        ]);

        // ensure no extra fields
        expect(Object.keys(res.body[0]).sort()).toEqual(["first_name", "last_name"]);
    });
});
