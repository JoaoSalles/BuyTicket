import { OrderCreatedEvent, Listener, Subjects } from '@estudos/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queueGroupName';
import { exparationQueue } from '../../queues/expirationQueue';


export class OrderCreatedListeners extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(`waiting for delay to publish the job ${delay} miliseconds`)
        await exparationQueue.add({
            orderId: data.id
        },{
            delay,
        });

        msg.ack();
    }
}