import request from "supertest";
import app from "../src/index";
import { User } from "../src/services/databaseService";

describe("CRUD Server API", () => {
  let userId: number;

  // Test for POST (creating a new user)
  it("POST /users - should create a new user", async () => {
    const newUser: User = {
      nickname: "testUser",
      first_name: "Test",
      last_name: "User",
      email: "testuser@example.com",
    };
    const res = await request(app).post("/users").send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.nickname).toBe(newUser.nickname);
    userId = res.body.id;
  });

  // Test for GET (fetching all users)
  it("GET /users - should return a list of users", async () => {
    const res = await request(app).get("/users");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test for GET by ID (fetching a user by ID)
  it("GET /users/:id - should return a user by id", async () => {
    const res = await request(app).get(`/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
  });

  // Test for PATCH (partial update of user data)
  it("PATCH /users/:id - should update user data", async () => {
    const updates = {
      last_name: "UpdatedLastName",
    };
    const res = await request(app).patch(`/users/${userId}`).send(updates);

    expect(res.statusCode).toBe(200);
    expect(res.body.last_name).toBe(updates.last_name);
  });

  // Test for DELETE (deleting a user by ID)
  it("DELETE /users/:id - should delete a user by id", async () => {
    const res = await request(app).delete(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User deleted successfully");
    const checkRes = await request(app).get(`/users/${userId}`);
    expect(checkRes.statusCode).toBe(404);
  });
});
