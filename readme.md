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

```mermaid
sequenceDiagram
    box Frontend
        actor all as All Users
        actor cl as User
    end
    box Backend
        participant ws as WebSocket Server
        participant db as In-Memory Database
        participant ps as PubSub Channel
        participant updater as Client Updater
    end
    note over all, updater: Initial load
    cl ->> ws: connect
    db ->> ws: getTickets()
    ws ->> cl: Tickets(ts:List[Ticket])
    note over all, updater: Lock ticket
    cl ->> ws: LockTicket(ticketId:UUID)
    ws ->> db: lock(ticketId:UUID)
    ws ->> ps: TicketLocked(ticketId:UUID)
    ps ->> updater: TicketLocked(ticketId:UUID)
    updater ->> all: TicketLocked(ticketId:UUID)
    note over all, updater: Update ticket
    cl ->> ws: UpdateTicket(ticket=Ticket)
    ws ->> db: update(ticket=Ticket)
    ws ->> ps: TicketUpdated(ticket=Ticket)
    ps ->> updater: TicketUpdated(ticket=Ticket)
    updater ->> all: TicketUpdated(ticket=Ticket)
    note over all, updater: Create ticket
    cl ->> ws: CreateTicket(ticket=Ticket)
    ws ->> db: create(ticket=Ticket)
    ws ->> ps: TicketCreated(ticket=Ticket)
    ps ->> updater: TicketCreated(ticket=Ticket)
    updater ->> all: TicketCreated(ticket=Ticket)
    note over all, updater: Unlock ticket
    cl ->> ws: UnlockTicket(ticketId:UUID)
    ws ->> db: unlock(ticketId:UUID)
    ws ->> ps: TicketUnlocked(ticketId:UUID)
    ps ->> updater: TicketUnlocked(ticketId:UUID)
    updater ->> all: TicketUnlocked(ticketId:UUID)
```
