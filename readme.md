<pre style="text-align: center">
_                 ____  _ _ _      _       
| |               |  _ \(_) | |    | |      
| |     ___  ___  | |_) |_| | | ___| |_ __ ®
| |    / _ \/ __| |  _ <| | | |/ _ \ __/ __|
| |___|  __/\__ \ | |_) | | | |  __/ |_\__ \
|______\___||___/ |____/|_|_|_|\___|\__|___/

.-.. . ... -... .. .-.. .-.. . - ...

Support Ticketing System
</pre>

### Notes

* **Bun** is a great runtime. Just is.
* **Code comments** are not necessary (hopefully).
* **Drizzle migrations** are fragile: one day they work, on another day — no.
  > Something like `for f in *.sql; do cat $i | sqlite3 tickets.db; done` will
  work always.
* **Drizzle** has to go at some point. My distrust of ORMs once again proves
  itself to be warranted.
* **Unit tests** would be virtually useless. Types do the heavy lifting for you.
* **Integration tests** would be very nice to have.
* **TypeScript** happens to be a great language if you know how to use it.

### Message Flow Diagram

> This diagram is somewhat outdated but it should provide a good idea, what the
> system is supposed to do. > > To learn more on how it works, start with
> `package.json` in `packages/*` and work your way down.
>
> Open an issue, if something is unclear.

```mermaid
sequenceDiagram
    box Frontend
        actor all as All Users
        actor cl as User
    end
    box Backend
        participant ws as WebSocket Server
        participant db as In-Memory Database
        participant pubSub as PubSub Channel
        participant updater as Client Updater
    end
    note over all, updater: Initial load
    cl ->> ws: ClientMessage::GetTickets
    db ->> ws: getTickets()
    ws ->> cl: ServerMessage::AllTickets(tickets:List[Ticket])
    note over all, updater: Lock ticket
    cl ->> ws: ClientMessage::LockTicket(ticketId:UUID)
    ws ->> db: lock(ticketId:UUID)
    ws ->> pubSub: WireEvent::TicketUpdated(ticketId:UUID)
    pubSub ->> updater: WireEvent::TicketLocked(ticketId:UUID)
    par update
        updater ->> cl: ServerMessage::TicketLocked(ticketId:UUID)
        updater ->> all: ServerMessage::TicketLocked(ticketId:UUID)
    end
    note over all, updater: Update ticket
    cl ->> ws: ClientMessage::UpdateTicket(ticket=Ticket)
    ws ->> db: update(ticket=Ticket)
    ws ->> pubSub: TicketUpdated(ticket=Ticket)
    pubSub ->> updater: TicketUpdated(ticket=Ticket)
    updater ->> all: TicketUpdated(ticket=Ticket)
    note over all, updater: Create ticket
    cl ->> ws: ClientMessage::CreateTicket(ticket=Ticket)
    ws ->> db: create(ticket=Ticket)
    ws ->> pubSub: TicketCreated(ticket=Ticket)
    pubSub ->> updater: TicketCreated(ticket=Ticket)
    updater ->> all: TicketCreated(ticket=Ticket)
    note over all, updater: Unlock ticket
    cl ->> ws: ClientMessage::UnlockTicket(ticketId:UUID)
    ws ->> db: unlock(ticketId:UUID)
    ws ->> pubSub: TicketUnlocked(ticketId:UUID)
    pubSub ->> updater: TicketUnlocked(ticketId:UUID)
    updater ->> all: TicketUnlocked(ticketId:UUID)
```
