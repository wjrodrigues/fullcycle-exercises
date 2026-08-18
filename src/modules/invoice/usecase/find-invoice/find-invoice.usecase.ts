import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto";

export default class FindInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceRepository: InvoiceGateway) { }

  async execute(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {

    const persistedInvoice = await this.invoiceRepository.find(
      input.id
    );

    const persistedItems = persistedInvoice.items.map((item) => ({ id: item.id.id, price: item.price, name: item.name }))
    const total = persistedInvoice.items.reduce((total, item) => total + item.price, 0)

    return {
      id: persistedInvoice.id.id,
      document: persistedInvoice.document,
      items: persistedItems,
      name: persistedInvoice.name,
      address: {
        city: persistedInvoice.address.city,
        complement: persistedInvoice.address.complement,
        number: persistedInvoice.address.number,
        street: persistedInvoice.address.street,
        state: persistedInvoice.address.state,
        zipCode: persistedInvoice.address.zipCode,
      },
      createdAt: persistedInvoice.createdAt,
      total
    };
  }
}
