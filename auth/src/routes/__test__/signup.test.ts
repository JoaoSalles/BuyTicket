import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: 'test' })
        .expect(201)
})

it('returns a 400 with a invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({ email: 'test', password: 'test' })
        .expect(400)
})

it('returns a 400 with empty password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: '' })
        .expect(400)
})

it('returns a 400 with invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: '1' })
        .expect(400)
})

it('dissalow duplicate email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: '12345' })
        .expect(201)

    await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: '12345' })
        .expect(400)
})

it('it sets a cookie with successful request', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: '12345' })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined();
})