const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    product : {type : mongoose.Schema.Types.ObjectId , ref : 'Product', required : true },
    quantity : {type : Number , default: 1 } // by default its set to 1 if the user does not enteres any data
})

module.exports = mongoose.model('Order',orderSchema);