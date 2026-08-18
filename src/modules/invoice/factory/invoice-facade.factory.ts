import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class InvoiceFacadeFactory {
  static create(): InvoiceFacade {
    const invoiceRepository = new InvoiceRepository();
    const generateUseCase = new GenerateInvoiceUseCase(invoiceRepository);

    const facade = new InvoiceFacade({
      generateUseCase: generateUseCase,
    });

    return facade;
  }
}
