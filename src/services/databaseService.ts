import sqlite3 from "sqlite3";

export interface User {
  id?: number;
  nickname: string;
  first_name: string;
  last_name: string;
  email: string;
}

class DatabaseService {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database("users.db");
    this.initDatabase();
  }

  // Initialize the database and create users table if it doesn't exist
  private initDatabase() {
    return new Promise<void>((resolve, reject) => {
      this.db.run(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, nickname TEXT, first_name TEXT, last_name TEXT, email TEXT)",
        (err) => {
          if (err) {
            console.error("Failed to initialize the database:", err.message);
            reject(err);
            return;
          }
          console.log("Database initialized successfully.");
          resolve();
        }
      );
    });
  }

  //Create a new user
  createUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      const { nickname, first_name, last_name, email } = user;
      this.db.run(
        "INSERT INTO users (nickname, first_name, last_name, email) VALUES (?, ?, ?, ?)",
        [nickname, first_name, last_name, email],
        function (err) {
          if (err) {
            console.error("Error creating user:", err.message);
            reject(err);
            return;
          }
          resolve({ id: this.lastID, ...user });
        }
      );
    });
  }

  // Get all users
  getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM users", (err, rows: User[]) => {
        if (err) {
          console.error("Error fetching users:", err.message);
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  // Get a user by ID
  getUserById(id: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM users WHERE id =?", [id], (err, row: User) => {
        if (err) {
          console.error("Error fetching user by ID:", err.message);
          reject(err);
          return;
        }
        resolve(row || null);
      });
    });
  }

  // Update a user by ID
  updateUser(id: number, user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      const { nickname, first_name, last_name, email } = user;
      this.db.run(
        "UPDATE users SET nickname =?, first_name =?, last_name =?, email =? WHERE id =?",
        [nickname, first_name, last_name, email, id],
        function (err) {
          if (err) {
            console.error("Error updating user:", err.message);
            reject(err);
            return;
          }
          if (this.changes === 0) {
            reject(new Error("User not found"));
            return;
          }
          resolve({ id, ...user });
        }
      );
    });
  }

  // Partially update user by ID
  patchUser(id: number, updates: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(", ");
      const values = [...Object.values(updates), id];
      this.db.run(
        `UPDATE users SET ${fields} WHERE id = ?`,
        values,
        function (err) {
          if (err) {
            console.error("Error patching user:", err.message);
            reject(err);
            return;
          }
          if (this.changes === 0) {
            reject(new Error("User not found"));
            return;
          }
          const updatedUser: User = {
            id,
            nickname: updates.nickname || "",
            first_name: updates.first_name || "",
            last_name: updates.last_name || "",
            email: updates.email || "",
          };
          resolve(updatedUser);
        }
      );
    });
  }

  // Delete a user by ID
  deleteUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) {
          console.error("Error deleting user:", err.message);
          reject(err);
          return;
        }
        if (this.changes === 0) {
          reject(new Error("User not found"));
          return;
        }
        resolve();
      });
    });
  }
}
export default new DatabaseService();
