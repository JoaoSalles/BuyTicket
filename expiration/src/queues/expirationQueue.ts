import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expirationCompletePublisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
    orderId: string;

}

const exparationQueue = new Queue<Payload>('order:exparation', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

exparationQueue.process(async (job) => {
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
});

export { exparationQueue };