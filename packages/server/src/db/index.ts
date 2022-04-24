import getDB from "./getDB";
import OrderDetailsModel from "./models/OrderDetailsModel";
import OrderModel from "./models/OrderModel";
import ProductModel from "./models/ProductModel";
import UserModel from "./models/UserModel";
import { createSeeds } from "./seeds";

export async function initDB() {
  const sequelize = getDB();
  await sequelize.authenticate();
  OrderModel.hasMany(OrderDetailsModel, {
    sourceKey: "id",
    foreignKey: "orderId",
    as: "details",
  });
  OrderDetailsModel.belongsTo(ProductModel, {
    foreignKey: "productId",
    targetKey: "id",
    as: "product",
  });
  try {
    await UserModel.findAndCountAll();
  } catch (e) {
    // schema not exists
    await sequelize.sync({ force: true });
    await createSeeds();
  }
}
