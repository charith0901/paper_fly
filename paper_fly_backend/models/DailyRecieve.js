import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import NewsPaper from "./NewsPaper.js";

const DailyRecieve = sequelize.define(
  "daily_recieve",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    newspaperCopies: {
      type: DataTypes.JSON,
      allowNull: false,
      comment:
        "JSON array of objects with newspaper_id and quantity fields. Example: [{newspaper_id: 1, quantity: 10}, {newspaper_id: 2, quantity: 5}]",
    }
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

DailyRecieve.prototype.getNewspapers = async function() {
        const newspaperIds = this.newspaperCopies.map(item => item.newspaper_id);
        return await NewsPaper.findAll({
            where: {
                id: newspaperIds
            }
        });
    };

export default DailyRecieve;