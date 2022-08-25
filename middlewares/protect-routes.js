function protectRoutes(req, res, next) {
    if (req.path.startsWith('/admin') && !res.locals.isAdmin) {
        return res.redirect('/403');
    }
    next();
}

module.exports = protectRoutes;
