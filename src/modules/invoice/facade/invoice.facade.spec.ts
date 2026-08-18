import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/invoice-facade.factory";

describe("InvoiceFacade", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceItemModel, InvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const input = {
      name: 'Invoice_1',
      document: 'NF_1',
      street: 'Address 20',
      number: '1',
      complement: 'house',
      city: 'SP',
      state: 'SP',
      zipCode: '00000000',
      items: [
        { id: '1', name: 'Mouse', price: 100 }
      ]
    };

    const result = await facade.generateInvoice(input);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
  });

  it("should find invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const input = {
      name: 'Invoice_1',
      document: 'NF_1',
      street: 'Address 20',
      number: '1',
      complement: 'house',
      city: 'SP',
      state: 'SP',
      zipCode: '00000000',
      items: [
        { id: '1', name: 'Mouse', price: 100 },
        { id: '2', name: 'Cable', price: 23 }
      ]
    };

    const invoice = await facade.generateInvoice(input);
    const result = await facade.findInvoice({ id: invoice.id });

    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.address.street).toBe(input.street);
    expect(result.address.number).toBe(input.number);
    expect(result.address.complement).toBe(input.complement);
    expect(result.address.city).toBe(input.city);
    expect(result.address.state).toBe(input.state);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.items[1].id).toBe(input.items[1].id);
    expect(result.items[1].name).toBe(input.items[1].name);
    expect(result.items[1].price).toBe(input.items[1].price);
    expect(result.total).toBe(123);
    expect(result.createdAt).toBeDefined();
  })
});
