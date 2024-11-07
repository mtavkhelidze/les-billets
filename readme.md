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

### Architecture
```mermaid
sequenceDiagram
    box Frontend
        actor others as Other Users
        actor cl as User
    end
    box Backend
        participant ws as WebSocket Server
    end
    cl ->> ws: connect
    ws ->> cl: Tickets(ts:List[Ticket])
    cl ->> ws: Lock(ticketId:UUID)
    ws ->> others: LockUpdate(ticketId:UUID, locked=true)
    cl ->> ws: Update(ticket:Ticket)
    ws ->> others: UpdatedTicket(ticket=Ticket)
```
