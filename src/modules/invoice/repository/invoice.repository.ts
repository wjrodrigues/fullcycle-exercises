import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async save(input: Invoice): Promise<Invoice> {
    await InvoiceModel.create({
      id: input.id.id,
      name: input.name,
      document: input.document,
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zipcode: input.address.zipCode,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      items: input.items
    })

    return new Invoice({
      id: input.id,
      name: input.name,
      document: input.document,
      address: input.address,
      items: input.items
    });
  }
}
