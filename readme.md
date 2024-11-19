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

### Message Flow Diagram

<span style="font-size: 1.2rem; color: red">This diagram is completely outdated.</span>

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
        updater ->>  cl: ServerMessage::TicketLocked(ticketId:UUID)
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
