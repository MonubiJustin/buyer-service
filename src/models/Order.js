import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: "Quantity cannot be less than 0"
        }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    deliveryLocation: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

export { Order };