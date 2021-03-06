import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@estudos/common';
import { queueGroupName } from './queueGroupName';
import { Ticket } from '../../models/tickets';
import { TicketUpdatedPublisher } from '../publishers/ticketUpdatedPublisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket) {
            throw new Error("Ticket not found");
        }

        ticket.set({ orderId: data.id });

        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
        });

        msg.ack();
    }
}