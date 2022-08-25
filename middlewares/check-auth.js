function checkAuthStatus(req, res, next) {
    const uid = req.session.uid;
    if (!uid) return next();

    res.locals.uid = uid;
    res.locals.isAuthentificated = true;
    res.locals.isAdmin = req.session.isAdmin;
    next();
}

module.exports = checkAuthStatus;
