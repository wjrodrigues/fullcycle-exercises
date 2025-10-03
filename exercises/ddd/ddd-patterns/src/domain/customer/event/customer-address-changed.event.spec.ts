import EventDispatcher from "@domain/@shared/event/event-dispatcher";
import SendConsoleLogAddressChangedHandler from "./handler/send-console-log-address-changed.handler";
import CustomerAddressChangedEvent from "./customer-address-changed.event";

describe("CustomerAddressChangedEvent", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogAddressChangedHandler();

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"],
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length,
    ).toBe(1);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].at(0),
    ).toMatchObject(eventHandler);
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogAddressChangedHandler();

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    const spyEventHandler = jest.spyOn(eventHandler, "handle");
    const spyConsole = jest.spyOn(console, "log");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    const customerCreatedEvent = new CustomerAddressChangedEvent({
      id: 1,
      name: "Customer",
      address: "Av. Central",
    });

    eventDispatcher.notify(customerCreatedEvent);
    expect(spyEventHandler).toHaveBeenCalled();

    expect(spyConsole).toHaveBeenCalledWith(
      "Endereço do cliente: 1, Customer alterado para: Av. Central",
    );
  });
});
