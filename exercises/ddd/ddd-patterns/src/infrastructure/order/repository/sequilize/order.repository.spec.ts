import { Sequelize } from "sequelize-typescript";
import Address from "@domain/customer/value-object/address";
import Customer from "@domain/customer/entity/customer";
import CustomerRepository from "@infrastructure/customer/repository/sequelize/customer.repository";
import Order from "@domain/checkout/entity/order";
import OrderItem from "@domain/checkout/entity/order_item";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import Product from "@domain/product/entity/product";
import ProductRepository from "@infrastructure/product/repository/sequelize/product.repository";
import { sequilizeInstance } from "@infrastructure/utils/test-helper";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => (sequelize = await sequilizeInstance()));

  afterEach(async () => await sequelize.close());

  const newCustomer = async (id: string) => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer(id, `Person #{id}`);
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    return customer;
  };

  const newProduct = async (id: string, price = 10) => {
    const productRepository = new ProductRepository();

    const product = new Product(id, `Product ${id}`, price);

    await productRepository.create(product);

    return product;
  };

  const newOrder = async (id: string, product: Product) => {
    const orderItem = new OrderItem(
      id,
      product.name,
      product.price,
      product.id,
      2,
    );

    const customer = await newCustomer(id);
    const order = new Order(id, customer.id, [orderItem]);

    const orderRepository = new OrderRepository(sequelize);

    await orderRepository.create(order);

    return order;
  };

  describe("create", () => {
    it("should create a new order", async () => {
      const product = await newProduct("1");
      const order = await newOrder("1", product);

      const orderExpected = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      });

      expect(orderExpected.toJSON()).toStrictEqual({
        id: order.id,
        customer_id: order.customerId,
        total: order.total(),
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: order.id,
        })),
      });
    });
  });

  describe("findAll", () => {
    it("should returns all created orders", async () => {
      for (let idx in [1, 2, 3, 4]) {
        let product = await newProduct(idx);
        await newOrder(idx, product);
      }

      const ordersExpected = await OrderModel.findAll({
        include: ["items"],
        order: [["id", "DESC"]],
      });

      expect(ordersExpected.length).toEqual(4);

      const orderRepository = new OrderRepository(sequelize);
      const ordersResponse = await orderRepository.findAll();

      ordersExpected.forEach((orderExpected: any, idx: number) => {
        expect(orderExpected.toJSON()).toStrictEqual({
          id: ordersResponse.at(idx).id,
          customer_id: ordersResponse.at(idx).customerId,
          total: ordersResponse.at(idx).total(),
          items: ordersResponse.at(idx).items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
            order_id: ordersResponse.at(idx).id,
          })),
        });
      });
    });

    it("should return empty array if there are no orders", async () => {
      const orderExpected = await OrderModel.findAll();

      expect(orderExpected).toEqual([]);
    });
  });

  describe("find", () => {
    it("should return created order", async () => {
      const product = await newProduct("1");
      const order = await newOrder("1", product);

      const orderExpected = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      });

      const orderRepository = new OrderRepository(sequelize);
      const orderResponse = await orderRepository.find(order.id);

      expect(orderExpected.toJSON()).toStrictEqual({
        id: orderResponse.id,
        customer_id: orderResponse.customerId,
        total: orderResponse.total(),
        items: orderResponse.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: orderResponse.id,
        })),
      });
    });

    it("should return null if it does not find the order", async () => {
      const orderExpected = await OrderModel.findOne({
        where: { id: "any" },
      });

      expect(orderExpected).toBeNull();
    });
  });

  describe("update", () => {
    it("should change the items and update the total", async () => {
      const product = await newProduct("1");
      const order = await newOrder("1", product);
      const orderRepository = new OrderRepository(sequelize);
      let orderResponse = await orderRepository.find(order.id);

      expect(orderResponse.total()).toEqual(20);
      expect(orderResponse.items).toEqual(order.items);

      const product2 = await newProduct("2");

      const orderItem = new OrderItem(
        "2",
        product2.name,
        product2.price,
        product2.id,
        1,
      );

      order.addItem(orderItem);

      await orderRepository.update(order);

      const orderExpected = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      });

      expect(orderExpected.toJSON()).toStrictEqual({
        id: order.id,
        customer_id: order.customerId,
        total: order.total(),
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: order.id,
        })),
      });
    });
  });
});
