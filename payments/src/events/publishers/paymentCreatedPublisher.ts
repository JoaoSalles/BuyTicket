import { Subjects, Publisher, PaymentCreatedEvent } from "@estudos/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}