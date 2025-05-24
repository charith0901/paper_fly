import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Bill = sequelize.define(
    "Bill", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        profitRate: {
            type: DataTypes.FLOAT,
            allowNull: false,
            comment: "Profit rate in percentage"
        },
        totalIncome: {
            type: DataTypes.FLOAT,
            allowNull: false,
            comment: "Total income from the bill"
        },
        totalExpense: {
            type: DataTypes.FLOAT,
            allowNull: false,
            comment: "Total expense from the bill"
        },
    },
    {
        timestamps: false
    }
    );

export default Bill;
