import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceModel from "./invoice.model";
import Invoice from "../domain/invoice.entity";
import InvoiceRepository from "./invoice.repository";
import InvoiceItem from "../domain/invoice-item.entity";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItemModel from "./invoice-item.model";

describe("InvoiceRepository", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should save a invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: 'Invoice_1',
      document: 'NF_1',
      address: new Address('Address 20', '1', 'house', 'SP', 'SP', '00000000'),
      items: [
        new InvoiceItem({ id: new Id('1'), name: 'Mouse', price: 100 })
      ]
    });

    const repository = new InvoiceRepository();
    const result = await repository.save(invoice);

    expect(result.id.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address).toBe(invoice.address);
    expect(result.items).toBe(invoice.items);
  });
});
