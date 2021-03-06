import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListeners } from './events/listeners/orderCreatedListener';
import { OrderCancelledListener } from './events/listeners/orderCancelledListener';

const startUp = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is undefined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is undefined');
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID is undefined');
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID is undefined');
    }

    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL is undefined');
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new OrderCancelledListener(natsWrapper.client).listen();
        new OrderCreatedListeners(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
       });
       console.log('connected to mongo db')
    } catch (err) {
        console.error(err);
    }
}

app.listen(3000, () => {
    console.log('running ticket on port 3000!!');
});


startUp();