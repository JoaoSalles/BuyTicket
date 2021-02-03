import express, { Request, Response } from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@estudos/common';
import { Order } from '../models/order';

const router = express.Router();


router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response ) => {
    const orderId = req.params.orderId;
    
    const order = await Order.findById(orderId).populate('ticket');

    if(!order) {
        throw new NotFoundError();
    }
    console.log("aqui", order.userId, req.currentUser )
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    res.send(order);
});

export { router as showOrderRouter };