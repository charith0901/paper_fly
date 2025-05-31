import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import NewsPaper from "./NewsPaper.js";

const DailyRecieve = sequelize.define(
  "daily_recieve",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    bill_id: {
      type: DataTypes.UUID, // Changed from INTEGER to UUID
      allowNull: true,
      comment: "Foreign key to the Bill table",
      references: {
        model: "bills",
        key: "id", // Explicitly specify the referenced key
      },
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

DailyRecieve.prototype.getNewspapers = async function () {
  const newspaperIds = this.newspaperCopies.map((item) => item.newspaper_id);
  return await NewsPaper.findAll({
    where: {
      id: newspaperIds,
    },
  });
};

export default DailyRecieve;