function validateMedicine(req, res, next){
    if(req.body.name.trim() === '' || req.body.name === ' '){
        return res.status(400).send({message:'Medicine name cannot be empty'})
    }
    if(req.body.description.trim() === '' || req.body.description === ' ' ){
        return res.status(400).send({message:'Medicine description cannot be empty'})
    }
    if(req.body.uses.trim() === '' || req.body.uses === ' ' ){
        return res.status(400).send({message:'Medicine uses cannot be empty'})
    }
    if(req.body.dosage.trim() === '' || req.body.dosage === ' ' ){
        return res.status(400).send({message:'Medicine dosage cannot be empty'})
    }
    if(req.body.sideeffects.trim() === '' || req.body.sideeffects === ' ' ){
        return res.status(400).send({message:'Medicine side effects cannot be empty'})
    }
    if(req.body.precautions.trim() === '' || req.body.precautions === ' ' ){
        return res.status(400).send({message:'Medicine precautions cannot be empty'})
    }
    return next();
}
module.exports = validateMedicine;