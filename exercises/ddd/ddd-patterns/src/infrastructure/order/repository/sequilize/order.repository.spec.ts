import { Sequelize } from "sequelize-typescript";
import Order from "@domain/checkout/entity/order";
import OrderItem from "@domain/checkout/entity/order_item";
import Customer from "@domain/customer/entity/customer";
import Address from "@domain/customer/value-object/address";
import Product from "@domain/product/entity/product";
import CustomerRepository from "@infrastructure/customer/repository/sequelize/customer.repository";
import ProductRepository from "@infrastructure/product/repository/sequelize/product.repository";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import { sequilizeInstance } from "@infrastructure/utils/spec";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = await sequilizeInstance();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Person 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2,
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });
});
