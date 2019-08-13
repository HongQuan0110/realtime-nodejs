module.exports.getHome = (req, res, next) => {
    return res.render('main/home/home.ejs', {
        errors: req.flash("errors"),
        success: req.flash("success"),
        user: req.user
    });
}
