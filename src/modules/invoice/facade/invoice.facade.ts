import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceUseCaseOutputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
  generateUseCase: GenerateInvoiceUseCase;
  findUseCase: FindInvoiceUseCase;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateUseCase: GenerateInvoiceUseCase;
  private _findUseCase: FindInvoiceUseCase;

  constructor(props: UseCaseProps) {
    this._generateUseCase = props.generateUseCase;
    this._findUseCase = props.findUseCase;
  }

  async generateInvoice(
    props: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    return await this._generateUseCase.execute(props);
  }

  async findInvoice(props: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
    return await this._findUseCase.execute(props)
  }
}
