import express from "express";
import {
    getOrders,
    getSingleOrder,
    createOrder,
    deleteOrder
} from "../controllers/ordersController.js"

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getSingleOrder);
router.post("/", createOrder);
router.delete("/:id", deleteOrder)



export default router;