import request from 'supertest';
import { app } from '../../app';


it('Clears cookie', async () =>{
    await request(app)
        .post('/api/users/signup')
        .send({ email: 'test@test.com', password: 'test' })
        .expect(201)

    let response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: "test"
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined();

    response =  await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200)

    expect(response.get('Set-Cookie')[0]).toBe("express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly");
})