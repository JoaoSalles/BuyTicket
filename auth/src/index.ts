import mongoose from 'mongoose';
import { app } from './app';

const startUp = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is undefined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is undefined');
    }

    try {
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
    console.log('running auth on port 3000!!');
});


startUp();