var mongoose = require('mongoose');

//medicine schema/table
var medicineScheme = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    uses:{
        type: String,
        required: true
    },
    dosage:{
        type: String,
        required: true
    },
    sideeffects:{
        type: String,
        required: true
    },
    precautions:{
        type: String,
        required: true
    }
});

var Medicine = module.exports = mongoose.model('Medicine', medicineScheme);

// get all medicine
module.exports.getMedicines = function(callback, limit){
    Medicine.find(callback).limit(limit);
}
