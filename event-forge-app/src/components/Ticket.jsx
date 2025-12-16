
export default function Ticket(){

    
    return (
        <div className="ticket">
            <p>Event ID: {props.eventID}</p>
            <p>Ticket ID: {props.ticketID}</p>
            <p>Type: {props.ticketType}</p>
            <p>Quantity: {props.quantity}</p>
            <p>Price: {props.price}</p>
        </div>
    )
}

