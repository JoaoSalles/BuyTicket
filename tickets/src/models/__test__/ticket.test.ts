import { Ticket } from '../tickets';

it('implements optimistic concurrency control', async (done) => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123',
    });

    await ticket.save();

    const firstIntance = await Ticket.findById(ticket.id);
    const secondIntance = await Ticket.findById(ticket.id);

    firstIntance.set({ price: 10});
    secondIntance.set({ price: 15 });

    await firstIntance.save();

    try {
        await secondIntance.save();
    } catch (err) {
        return done();
    }

    throw new Error('Should not reach this point');
});

it('increments the version number on mutiple save', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123',
    });

    await ticket.save();

    expect(ticket.version).toEqual(0);

    await ticket.save();

    expect(ticket.version).toEqual(1);

    await ticket.save();

    expect(ticket.version).toEqual(2);
})