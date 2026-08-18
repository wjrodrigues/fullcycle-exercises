import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeInterface, {GenerateInvoiceFacadeInputDto, GenerateInvoiceUseCaseOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
  generateUseCase: GenerateInvoiceUseCase;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateUseCase: GenerateInvoiceUseCase;

  constructor(props: UseCaseProps) {
    this._generateUseCase = props.generateUseCase;
  }

  async generateInvoice(
    props: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    return await this._generateUseCase.execute(props);
  }
  
}
