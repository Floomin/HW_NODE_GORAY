//Описание логики модуля databaseService

// Подключение модуля sqlite3
const sqlite3 = require('sqlite3').verbose();

// Класс для работы с базой данных SQLite
class DatabaseService {
    // Конструктор класса DatabaseService, который подключается к базе данных
    constructor() {
        this.db = new sqlite3.Database('./database.sqlite', (err) => {
            if (err) {
                console.error('Ошибка при подключении к базе данных: ', err.message);
            } else {
                console.log('База данных успешно подключена!');
                this.initializeDatabase();
            }
        });
    }

    // Метод для создания таблицы users в базе данных
    initializeDatabase() {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nickname TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL
        )
        `;
        this.db.run(createTableQuery, (err) => {
            if (err) {
                console.error('Ошибка при создании таблицы: ', err.message);
            } else {
                console.log('Таблица пользователей успешно создана!');
            }
        });
    }

    // Функция создания нового пользователя
    createUser(user, callback) {
        const { nickname, first_name, last_name, email } = user;
        const insertQuery = `
        INSERT INTO users (nickname, first_name, last_name, email)
        VALUES (?,?,?,?)
        `;
        this.db.run(insertQuery, [nickname, first_name, last_name, email], function (err) {
            if (err) {
                callback(err);
            } else {
                callback(null, { id: this.lastID, ...user });
            }
        });
    }

    // Фукнция запроса всех пользователей из таблицы
    getUsers(callback) {
        const selectQuery = 'SELECT * FROM users';
        this.db.all(selectQuery, (err, rows) => {
            if (err) {
                callback(err);
            } else {
                callback(null, rows);
            }
        });
    }

    //Фукнция полного обновления пользователя в таблице
    updateUser(id, user, callback) {
        const { nickname, first_name, last_name, email } = user;
        const updateQuery = `
        UPDATE users
        SET nickname = ?, first_name = ?, last_name = ?, email = ?
        WHERE id = ?
        `;
        this.db.run(updateQuery, [nickname, first_name, last_name, email, id], (err) => {
            if (err) {
                callback(err);
            } else {
                callback(null, { id, ...user });
            }
        });
    }

    // Функция частичного обновления пользователя в таблице
    partialUpdateUser(id, updates, callback) {
        const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);

        const partialUpdateQuery = `UPDATE users SET ${fields} WHERE id = ?`;

        this.db.run(partialUpdateQuery, [...values, id], (err) => {
            if (err) {
                callback(err);
            } else {
                callback(null, { id, ...updates });
            }
        });
    }

    // Функция удаления пользователя из таблицы
    deleteUser(id, callback) {
        const deleteQuery = 'DELETE FROM users WHERE id = ?';
        this.db.run(deleteQuery, [id], (err) => {
            if (err) {
                callback(err);
            } else {
                callback(null, { message: 'Пользователь успешно удалён' });
            }
        });
    }
}

module.exports = new DatabaseService();
