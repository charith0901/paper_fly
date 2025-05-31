import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Bill = sequelize.define(
    "bills", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    profitRate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        comment: "Profit rate in percentage"
    },
    initialCost: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    unsoldCost: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    soldCost: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    profit: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    payment: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("ongoing", "bill_calculated", "paid"),
        defaultValue: "ongoing",
        allowNull: false,
        comment: "Status of the bill"
    },
},
    {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

export default Bill;
