import { DataTypes } from "sequelize";
import {sequelize} from "../config/database.js";

const Stock = sequelize.define(
    'stock',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        newspaperId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'newspapers', 
                key: 'id'
            }
        },
        initialCopies: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        soldCopies: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dailyRecieveId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'daily_recieves', 
                key: 'id'
            }
        },
    },
    {
        timestamps: false
    }
);

export default Stock;



