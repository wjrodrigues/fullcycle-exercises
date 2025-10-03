import EventDispatcher from "@domain/@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import SendConsoleLogFirstHandler from "./handler/send-console-log-first.handler";
import SendConsoleLogSecondHandler from "./handler/send-console-log-second.handler";

describe("CustomerCreatedEvent", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const firstEventHandler = new SendConsoleLogFirstHandler();
    const secondEventHandler = new SendConsoleLogSecondHandler();

    eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"],
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length,
    ).toBe(2);

    [firstEventHandler, secondEventHandler].forEach((handler, idx) => {
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][idx],
      ).toMatchObject(handler);
    });
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const firstEventHandler = new SendConsoleLogFirstHandler();
    const secondEventHandler = new SendConsoleLogSecondHandler();

    const spyFirstEventHandler = jest.spyOn(firstEventHandler, "handle");
    const spySecondEventHandler = jest.spyOn(secondEventHandler, "handle");
    const spyConsole = jest.spyOn(console, "log");

    eventDispatcher.register("CustomerCreatedEvent", firstEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", secondEventHandler);

    const customerCreatedEvent = new CustomerCreatedEvent({ name: "Customer" });

    eventDispatcher.notify(customerCreatedEvent);
    expect(spyFirstEventHandler).toHaveBeenCalled();
    expect(spySecondEventHandler).toHaveBeenCalled();

    expect(spyConsole).toHaveBeenNthCalledWith(
      1,
      "Esse é o primeiro console.log do evento: CustomerCreated",
    );
    expect(spyConsole).toHaveBeenNthCalledWith(
      2,
      "Esse é o segundo console.log do evento: CustomerCreated",
    );
  });
});
