import Address from "../../entity/address";
import Customer from "../../entity/customer";
import CustomerChangedAddressEvent from "../customer/customer-changed-address.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import EnviaConsoleLogHandler from "../customer/handler/envia-consolelog.handler";
import EnviaConsoleLog1Handler from "../customer/handler/envia-consolelog1.handler";
import EnviaConsoleLog2Handler from "../customer/handler/envia-consolelog2.handler";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
    it("should register a product created event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should register a customer created event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerCustomer = new EnviaConsoleLog1Handler();
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerCustomer);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandlerCustomer);
    });

    it("should register a customer changed address event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerCustomer = new EnviaConsoleLogHandler();
        eventDispatcher.register("CustomerChangedAddressEvent", eventHandlerCustomer);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandlerCustomer);
    });

    it("should unregister a product created event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should unregister a customer created event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerCustomer = new EnviaConsoleLog1Handler();
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerCustomer);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandlerCustomer);
        eventDispatcher.unregister("CustomerCreatedEvent", eventHandlerCustomer);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);
    });

    it("should unregister a customer changed address event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerCustomer = new EnviaConsoleLogHandler();
        eventDispatcher.register("CustomerChangedAddressEvent", eventHandlerCustomer);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandlerCustomer);
        eventDispatcher.unregister("CustomerChangedAddressEvent", eventHandlerCustomer);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(0);
    });

    it("should unregister all events handlers", () => {
        const eventDispatcher = new EventDispatcher();
        /* PRODUCT */
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        /* END PRODUCT */

        /* CUSTOMER */
        const eventHandlerCustomer = new EnviaConsoleLog1Handler();
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerCustomer);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandlerCustomer);
        const eventHandlerCustomerChangedAddress = new EnviaConsoleLogHandler();
        eventDispatcher.register("CustomerChangedAddressEvent", eventHandlerCustomerChangedAddress);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandlerCustomerChangedAddress);
        /* END CUSOTMER */

        eventDispatcher.unregisterAll();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeUndefined();
    });

    it("should notify all product created events handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        });
        //Quando o notify for executado o SendEmailWhenProductIsCreated.Handler.handle() deve ser chamado 
        eventDispatcher.notify(productCreatedEvent);
        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should notify all customer created events handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1Customer = new EnviaConsoleLog1Handler();
        const eventHandler2Customer = new EnviaConsoleLog2Handler();
        const spyEventHandler1Customer = jest.spyOn(eventHandler1Customer, "handle");
        const spyEventHandler2Customer = jest.spyOn(eventHandler2Customer, "handle");
        eventDispatcher.register("CustomerCreatedEvent", eventHandler1Customer);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2Customer);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1Customer);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2Customer);
        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "1",
            name: "Customer 1",
        });
        //Quando o notify for executado o EnviaConsoleLog1.Handler.handle() e o EnviaConsoleLog2.Handler.handle() devem ser chamados 
        eventDispatcher.notify(customerCreatedEvent);
        expect(spyEventHandler1Customer).toHaveBeenCalled();
        expect(spyEventHandler2Customer).toHaveBeenCalled();
    });

    it("should notify all customer changed address events handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandlerCustomer = new EnviaConsoleLogHandler();
        const spyEventHandlerCustomer = jest.spyOn(eventHandlerCustomer, "handle");
        eventDispatcher.register("CustomerChangedAddressEvent", eventHandlerCustomer);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandlerCustomer);
        
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
    
        const customerChangedAddressEvent = new CustomerChangedAddressEvent(customer);
        //Quando o notify for executado o EnviaConsoleLog.Handler.handle() deve ser chamado 
        eventDispatcher.notify(customerChangedAddressEvent);
        expect(spyEventHandlerCustomer).toHaveBeenCalled();
    });
});