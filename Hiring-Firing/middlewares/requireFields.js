module.exports = (req, res, next) => {
    
    if (!req.body.companyName || !req.body.role || !req.body.jobLink || !req.body.batch) {
        return res.status(400).send("Mandatory field(s) missing/Input values not coherent with rules");
    }
        var dt = Date.now() + (90 * 24 * 60 * 60 * 1000);
        dt = new Date(dt);
        if (!req.body.jobExpiry)
            req.body.jobExpiry = dt;
    next();
};