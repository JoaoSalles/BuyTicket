import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from '../../nats-wrapper';

it('return a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
        title: 'test',
        price: 10
    })
    .expect(404);
});

it('return a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title: 'test',
        price: 10
    })
    .expect(401);

});

it('return a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'concert',
        price: 10
    }).expect(201)

    const updateResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
        title: 'test123',
        price: 10
    }).expect(401)

});

it('return a 400 if the provided invalid title or price', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'concert',
        price: 10
    }).expect(201)

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'test123',
        price: -1
    }).expect(400)

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: '',
        price: 10
    }).expect(400)
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'concert',
        price: 10
    }).expect(201)

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'concert1',
        price: 11
    }).expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()

    expect(ticketResponse.body.title).toEqual('concert1');
    expect(ticketResponse.body.price).toEqual(11);
});

it('publishes an event', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'concert',
        price: 10
    }).expect(201)

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'concert1',
        price: 11
    }).expect(200);


    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects a request if ticket is reserved', async () => {
    const cookie = global.signin();
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title: 'concert',
        price: 10
    }).expect(201)

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });

    await ticket!.save();

    await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title: 'concert1',
        price: 11
    }).expect(400);


    expect(natsWrapper.client.publish).toHaveBeenCalled();
});