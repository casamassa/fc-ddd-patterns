import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerChangedAddressEvent from "../customer-changed-address.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<CustomerChangedAddressEvent> {
    handle(event: CustomerChangedAddressEvent): void {
        console.log(`Endereço do cliente, Id: ${event.eventData.id}, Nome: ${event.eventData.name} foi alterado para: ${event.eventData.Address}`);
    }

}