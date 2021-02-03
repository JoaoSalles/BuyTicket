import { Publisher, Subjects, TicketUpdatedEvent } from '@estudos/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
