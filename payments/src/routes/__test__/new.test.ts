import request from 'supertest';
import mongoose from 'mongoose';
import { OrderStatus } from '@estudos/common';
import { app } from '../../app';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

it('returns 404 when purcharsing an order that does not exists', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdasa',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);
});

it('returns 401 when purcharsing an order that does not belong to the user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: 20
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'asdasa',
            orderId: order.id
        })
        .expect(401);
});

it('returns 400 when purcharsing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        status: OrderStatus.Cancelled,
        version: 0,
        price: 20
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'asdasa',
            orderId: order.id
        })
        .expect(400);
});

it('returns a 204 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        status: OrderStatus.Created,
        version: 0,
        price: 20
    });

    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(20*100);
    expect(chargeOptions.currency).toEqual('usd');
});
