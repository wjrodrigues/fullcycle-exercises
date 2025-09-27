import { Sequelize } from "sequelize-typescript";

import CustomerModel from "@infrastructure/customer/repository/sequelize/customer.model";
import OrderItemModel from "@infrastructure/order/repository/sequilize/order-item.model";
import OrderModel from "@infrastructure/order/repository/sequilize/order.model";
import ProductModel from "@infrastructure/product/repository/sequelize/product.model";

const sequilizeInstance = async (): Promise<Sequelize> => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
  });

  sequelize.addModels([
    CustomerModel,
    OrderModel,
    OrderItemModel,
    ProductModel,
  ]);

  await sequelize.sync();

  return sequelize;
};

export { sequilizeInstance }
