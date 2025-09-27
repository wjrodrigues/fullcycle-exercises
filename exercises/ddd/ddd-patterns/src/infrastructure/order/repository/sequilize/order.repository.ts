import Order from "@domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderItem from "@domain/checkout/entity/order_item";
import { Sequelize } from "sequelize";

export default class OrderRepository {
  private _instance: Sequelize

  constructor(instance: Sequelize) {
    this._instance = instance
  }

  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      },
    );
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: {
        id,
      },
      include: ["items"],
    });

    const items = this.parseItems(orderModel);

    return new Order(orderModel.id, orderModel.customer_id, items);
  }

  async findAll(): Promise<Order[]> {
    const ordersModel = await OrderModel.findAll({
      include: ["items"],
      order: [["id", "DESC"]],
    });

    const orders = ordersModel.map((orderModel) => {
      const items = this.parseItems(orderModel);
      return new Order(orderModel.id, orderModel.customer_id, items);
    });

    return orders;
  }

  async update(entity: Order): Promise<void> {
    const transaction = await this._instance.transaction();

    try {
      await OrderItemModel.destroy({
        where: { order_id: entity.id },
      });

      entity.items.forEach(async (item) => {
        await OrderItemModel.create({
          id: item.id,
          order_id: entity.id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          product_id: item.productId,
        });
      });

      await OrderModel.update(
        { total: entity.total() },
        {
          where: {
            id: entity.id,
          },
        },
      );
      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
    }
  }

  private parseItems = (entity: OrderModel): OrderItem[] => {
    return entity.items.map(
      (item) =>
        new OrderItem(
          item.id,
          item.name,
          item.price,
          item.product_id,
          item.quantity,
        ),
    );
  };
}
