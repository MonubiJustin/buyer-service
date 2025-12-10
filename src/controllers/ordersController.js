import { asyncErrorHandler } from "../middleware/asyncErrorHandler.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import axios from "axios";


// GET /orders  List all orders
export const getOrders = asyncErrorHandler(async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const totalItems = await Order.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const orders = await Order.find()
        .limit(limit)
        .skip(offset)
        .select("-__v");
    
    res.status(200).json({
        success: true,
        data: orders,
        totalItems,
        page,
        totalPages
    })
})

// GET /orders/:id: Get single order by ID
export const getSingleOrder = asyncErrorHandler(async (req, res) => {
    const id = req.params.id;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({
        success: false,
        message: "Order with the given ID not found"
    });

    res.status(200).json({
        success: true,
        data: order
    })
})

// POST /orders: Create new order
export const createOrder = asyncErrorHandler(async (req, res) => {
    const {
        buyer_id,
        product_id,
        quantity,
        deliveryLocation
    } = req.body;

    const user_exists = await User.findById(buyer_id);
    if (!user_exists) return res.status(404).json({
        success: false,
        message: "User not Found"
    });

    const url = `${process.env.PRODUCT_URL}/${product_id}`;
    const response = await axios.get(url);
    if (!response.data || !response.data.success) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    const product = response.data.data;

    // check the stock availability
    if (product.quantity < quantity || product.quantity === 0) return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.quantity} ${product.unit} available`
    });

    // calculate total price
    const totalPrice = quantity * product.price;

    // update product quantity in farmer service
    const newQuantity = product.quantity - quantity;
    console.log(newQuantity)
    await axios.patch(url, {
        quantity: newQuantity
    })

    // create order in buyer service
    const order = await Order.create({
        buyer_id,
        product_id,
        quantity,
        totalPrice,
        deliveryLocation,
        status: "pending"
    })
    
    res.status(201).json({
        success: true,
        data: order
    })
})

// DELETE /orders/:id
export const deleteOrder = asyncErrorHandler(async (req, res) => {
    const id = req.params.id;
    const order = await Order.findByIdAndDelete(id);
    const url = process.env.PRODUCT_URL;

    if (!order) return res.status(404).json({
        success: false,
        message: "Order Not Found"
    });

    const { quantity, product_id } = order;
    const { data } = await axios.get(`${url}/${product_id}`);
    if (!data || !data.success) return res.status(404).json({
        success: false,
        message: "product not found"
    })

    const product = data.data;
    const newQuantity = quantity + product.quantity;
    await axios.patch(`${url}/${product_id}`, {
        quantity: newQuantity
    })

    res.sendStatus(204);
})


// // PATCH /orders/:id
// export const updateOrder = asyncErrorHandler(async (req, res) => {
//     const {
//         buyer_id,
//         product_id,
//         quantity,
//         deliveryLocation
//     } = req.body;

//     const order_id = req.params.id;
//     const order = await Order.findById(order_id);
//     if (!order) return res.status(404).json({
//         success: false,
//         message: "Order not found"
//     })

//     if (buyer_id) {
//         const buyer = await User.findById(buyer_id);
//         if (!buyer) return res.status(404).json({
//             success: false,
//             message: "User not found"
//         })
//     }

//     if (product_id) {
//         const response = await axios.get(`${url}/${product_id}`);
//         if (!response.data || !response.data.success) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found"
//             });
//         }
//     }

//     if (quantity) {
//         const {data} = await axios.get()
//     }

    
// })