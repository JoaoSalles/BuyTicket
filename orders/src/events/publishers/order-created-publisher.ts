import { Publisher, OrderCreatedEvent, Subjects } from '@estudos/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
