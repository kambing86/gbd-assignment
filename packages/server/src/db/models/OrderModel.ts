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
import OrderDetailsModel from "./OrderDetailsModel";
import UserModel from "./UserModel";

class OrderModel extends Model<
  InferAttributes<OrderModel>,
  InferCreationAttributes<OrderModel>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<UserModel["id"]>;
  declare createdDate: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare user: NonAttribute<UserModel>;
  declare details: NonAttribute<OrderDetailsModel[]>;
}

OrderModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdDate: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: getDB(),
    modelName: "Order",
    createdAt: "createdDate",
  },
);

export default OrderModel;
