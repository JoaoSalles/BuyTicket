import { Publisher, Subjects, TicketCreatedEvent } from '@estudos/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
