import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('return 404 if ticket is not found', async () => {
    const id = mongoose.Types.ObjectId().toHexString();

    await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404)
});

it('return the ticket if ticket is found', async () => {
    const creteResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'concert',
        price: 10
    }).expect(201)

    const ticketResponse = await request(app)
    .get(`/api/tickets/${creteResponse.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)

    expect(ticketResponse.body.title).toEqual('concert');
    expect(ticketResponse.body.price).toEqual(10);
});