
function validateOrder(req, res, next){
    if (req.body.medicineName.trim() === '') {
        return res.status(400).send({message:"Please input medicine name"})
    }
    if (req.body.quantity.trim() === '') {
        return res.status(400).send({message:"Please input medicine quantity"})
    }
    return next();
}
module.exports = validateOrder;