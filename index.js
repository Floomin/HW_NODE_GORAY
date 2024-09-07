// CRUD Simple Server

// Импорт "фреймворка" express
const express = require('express');
// Подключение модуля databaseService
const databaseService = require('./service/databaseService');

const app = express();
const PORT = 3000;

// Включаем middleware для парсинга JSON
app.use(express.json());

// Описание логики CRUD операций

// Create - создание нового пользователя в базе данных
app.post('/users', (req, res) => {
    console.log('Полученные данные:', req.body);
    const user = req.body;
    if (!user) {
        return res.status(400).json({ error: 'Некорректные данные пользователя.' });
    }
    databaseService.createUser(user, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json(result);
    });
});

// Read - получение списка всех пользователей из базы данных
app.get('/users', (req, res) => {
    databaseService.getUsers((err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Update - полное обновление пользователя через put()
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { nickname, first_name, last_name, email } = req.body;
    if (!nickname || !first_name || !last_name || !email) {
        return res.status(400).json({ error: 'Все поля обязательны для полного обновления.' });
    }
    databaseService.updateUser(id, req.body, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Update - частичное обновление пользователя через patch()
app.patch('/users/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'Необходимо указать хотя бы одно поле для изменения.' });
    }

    databaseService.partialUpdateUser(id, updates, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Delete - удаление пользователя из базы данных
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    databaseService.deleteUser(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// Запуск сервера на порте 3000
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

module.exports = app;