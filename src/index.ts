import express, { Request, Response } from "express";
import databaseService from "./services/databaseService";
import { error } from "console";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Create (INSERT) a new user
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { nickname, first_name, last_name, email } = req.body;
    const result = await databaseService.createUser({
      nickname,
      first_name,
      last_name,
      email,
    });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Read (SELECT) all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await databaseService.getUsers();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

//Read (SELECT) user by ID
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await databaseService.getUserById(Number(id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update (PUT) user by ID
app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nickname, first_name, last_name, email } = req.body;
    const result = await databaseService.updateUser(Number(id), {
      nickname,
      first_name,
      last_name,
      email,
    });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

//Partially Update (PATCH) user by ID
app.patch("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = await databaseService.patchUser(Number(id), updates);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete (DELETE) user by ID
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await databaseService.deleteUser(Number(id));
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
