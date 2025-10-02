import EventHandlerInterface from "@domain/@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class SendConsoleLogAddressChangedHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle(event: CustomerAddressChangedEvent): void {
    const { id, name, address } = event.eventData;

    console.log(
      `Endereço do cliente: ${id}, ${name} alterado para: ${address}`,
    );
  }
}
