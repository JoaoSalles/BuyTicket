import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const createTickets = async () => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'concert',
        price: 10
    }).expect(201)

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'concert2',
        price: 10
    }).expect(201)
}

it('can fetch a lista of tickets', async () => {
    await createTickets();

    const responde = await request(app)
    .get('/api/tickets')
    .set('Cookie', global.signin())
    .send().expect(200)

    expect(responde.body.length).toEqual(2);
});