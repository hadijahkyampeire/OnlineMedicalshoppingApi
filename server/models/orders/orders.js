var mongoose = require('mongoose');

//medicine schema/table
var orderSchema = mongoose.Schema({
    medicineName:{
        type: String,
        required: true
    },
    quantity:{
        type: String,
        required: true
    },
    userEmail:{
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    }
});

var Order = module.exports = mongoose.model('Order', orderSchema);

// Add Order
module.exports.addOrder = function(order, callback){
    Order.create(order, callback);
}