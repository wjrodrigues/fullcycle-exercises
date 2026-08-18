import { BelongsTo, Column, Model, PrimaryKey, Table, ForeignKey } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
  tableName: "invoice-items",
  timestamps: false,
})
export default class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string

  @Column({ allowNull: false })
  name: string

  @Column({ allowNull: false })
  price: number


  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  invoiceId!: number;

  @BelongsTo(() => InvoiceModel)
  invoice: InvoiceModel
}
