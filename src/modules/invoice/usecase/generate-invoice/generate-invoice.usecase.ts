import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto
} from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceRepository: InvoiceGateway) { }

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const items = input.items.map((item) => new InvoiceItem({ id: new Id(item.id), name: item.name, price: item.price }))
    const address = new Address(
      input.street, input.number, input.complement, input.city, input.state, input.zipCode
    )

    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      items,
      address
    });


    const persistedInvoice = await this.invoiceRepository.save(
      invoice
    );

    const persistedItems = persistedInvoice.items.map((item) => ({ id: item.id.id, price: item.price, name: item.name }))
    const total = persistedInvoice.items.reduce((total, item) => total + item.price, 0)

    return {
      id: persistedInvoice.id.id,
      document: persistedInvoice.document,
      items: persistedItems,
      name: persistedInvoice.name,
      city: persistedInvoice.address.city,
      complement: persistedInvoice.address.complement,
      number: persistedInvoice.address.number,
      street: persistedInvoice.address.street,
      state: persistedInvoice.address.state,
      zipCode: persistedInvoice.address.zipCode,
      total
    };
  }
}
