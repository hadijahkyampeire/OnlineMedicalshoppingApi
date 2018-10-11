function validateAdmin(req, res, next){
    if (req.body.question.trim() === '') {
        return res.status(400).send({message:"Question can not be empty"})
    }
    if (req.body.password.trim() === '' || req.body.password === ' ') {
        return res.status(400).send({message:"Password can not be empty"})
    }
    if (req.body.username.trim() === '') {
        return res.status(400).send({message:"Username can not be empty"})
    }
    return next();
}
module.exports = validateAdmin;