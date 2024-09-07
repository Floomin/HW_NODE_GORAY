const request = require('supertest');
const app = require('../index');

describe('CRUD Server API', () => {
    let userId;

    it('POST /users - должен создать нового пользователя', async () => {
        const newUser = {
            nickname: 'floomin',
            first_name: 'Igor',
            last_name: 'Goray',
            email: 'floomin@gmail.com',
        };
        console.log('Отправка данных:', newUser);
        const res = await request(app).post('/users').send(newUser);
        console.log('Ответ сервера:', res.body);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        userId = res.body.id;
    });

    it('GET /users - должен вернуть список пользователей', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('PATCH /users/:id - должен обновить данные пользователя', async () => {
        const updatedUser = {
            first_name: 'Igor',
            last_name: 'Gorayovich',
            email: 'igor@gmail.com',
        };
        const res = await request(app).patch(`/users/${userId}`).send(updatedUser);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('first_name', 'Igor');
        expect(res.body).toHaveProperty('last_name', 'Gorayovich');
        expect(res.body).toHaveProperty('email', 'igor@gmail.com');
    });

    it('DELETE /users/:id - должен удалить пользователя по id', async () => {
        const res = await request(app).delete(`/users/${userId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Пользователь успешно удалён');

        const checkRes = await request(app).get(`/users/${userId}`);
        expect(checkRes.statusCode).toEqual(404);
    });
});
