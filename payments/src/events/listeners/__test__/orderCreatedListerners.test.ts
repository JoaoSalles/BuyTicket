import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from "@estudos/common";
import { OrderCreatedListeners } from '../orderCreatedListener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';

const setup  = async () => {
    const listener = new OrderCreatedListeners(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        userId: 'asdas',
        status: OrderStatus.Created,
        expiresAt: '1323',
        version: 0,
        ticket: {
            id: 'asdasd',
            price: 10
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg }
};

it('replicates order info', async () => {
    const { msg, data, listener } = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
    const { msg, data, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});