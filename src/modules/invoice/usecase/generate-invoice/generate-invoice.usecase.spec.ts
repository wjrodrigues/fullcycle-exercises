import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: 'Invoice_1',
  document: 'NF_1',
  address: new Address('Address 20', '1', 'house', 'SP', 'SP', '00000000'),
  items: [
    new InvoiceItem({ id: new Id('1'), name: 'Mouse', price: 100 })
  ]
});

const MockRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Process invoice usecase unit test", () => {
  it("should create invocie", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);
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

    const result = await usecase.execute(input);

    expect(result.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.street).toBe(invoice.address.street);
    expect(result.number).toBe(invoice.address.number);
    expect(result.complement).toBe(invoice.address.complement);
    expect(result.city).toBe(invoice.address.city);
    expect(result.state).toBe(invoice.address.state);
    expect(result.items[0].id).toBe(invoice.items[0].id.id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
  });
});
