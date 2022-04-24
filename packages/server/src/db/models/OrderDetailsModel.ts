import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import getDB from "../getDB";
import OrderModel from "./OrderModel";
import ProductModel from "./ProductModel";

class OrderDetailsModel extends Model<
  InferAttributes<OrderDetailsModel>,
  InferCreationAttributes<OrderDetailsModel>
> {
  declare orderId: ForeignKey<OrderModel["id"]>;
  declare productId: ForeignKey<ProductModel["id"]>;
  declare quantity: number;
  declare price: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare product: NonAttribute<ProductModel>;
}

OrderDetailsModel.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: getDB(),
    modelName: "OrderDetails",
    indexes: [
      {
        unique: true,
        fields: ["orderId", "productId"],
      },
    ],
  },
);

export default OrderDetailsModel;
