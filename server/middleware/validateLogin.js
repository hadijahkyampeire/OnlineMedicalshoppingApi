
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateLogin(req, res, next){
    if (req.body.email === '' || req.body.email === ' ') {
        return res.status(400).send({message:"Email can not be empty"})
    }
    if (req.body.password === '' || req.body.password === ' ') {
        return res.status(400).send({message:"Password can not be empty"})
    }
    if (!validateEmail(req.body.email)) {
        var err = new Error('Invalid email format.');
        err.status = 400;
        return res.status(400).send({message: "Invalid email format"});
    }
    return next();
}
module.exports = validateLogin;