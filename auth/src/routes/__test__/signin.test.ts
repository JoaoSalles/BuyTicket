import request from 'supertest';
import { app } from '../../app';

it('returns a 400 with a invalid email', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({ email: 'test', password: 'test' })
        .expect(400)
})

it('returns a 400 with empty password', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({ email: 'test@test.com', password: '' })
        .expect(400)
})

it('Fails when email supplied does not exist', async () =>{
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: "test"
        })
        .expect(400)
})

it('Fails when a incorrect password is supplied', async () =>{
    await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: 'test' })
        .expect(201)

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: "test1"
        })
        .expect(400)
})


it('Sign with a correct credentials and get cookie', async () =>{
    await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: 'test' })
        .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: "test"
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined();
})