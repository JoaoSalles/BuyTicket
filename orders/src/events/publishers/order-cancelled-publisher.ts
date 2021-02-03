import { Publisher, OrderCancelledEvent, Subjects } from '@estudos/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
