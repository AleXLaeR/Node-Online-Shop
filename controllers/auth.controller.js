const UserModel = require('../models/user.model');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
    let sessionData = sessionFlash.getSessionData(req) || {
        email: '',
        confirmEmail: '',
        password: '',
        fullName: '',
        street: '',
        postalCode: '',
        city: '',
    };
   res.render('customer/auth/signup', { inputData: sessionData });
}

function getLogin(req, res) {
    let sessionData = sessionFlash.getSessionData(req) || {
        email: '',
        password: '',
    };
    res.render('customer/auth/login', { inputData: sessionData });
}

async function onSignup(req, res, next) {
    const user = new UserModel(req.body);
    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password: req.body.password,
        fullName: req.body.fullname,
        street: req.body.street,
        postalCode: req.body.postcode,
        city: req.body.city,
    }

    const doesUserExist = await user.doesExistAlready();

    if (!user.isDataValid() || doesUserExist
        || req.body['email'] !== req.body['confirm-email']) {

        sessionFlash.flashDataToSession(
            req,
            {
                errorMessage:
                    (doesUserExist) ?
                        `User exists already! Try logging in instead!`
                    :
                        `Please check your input;
                         Password must be at least 8 character long,
                         Postal code must be 5 characters long.
                        `,
                ...enteredData
            },
            () => {
                res.redirect('/signup');
            });
        return;
    }

    try {
        await user.signup();
    } catch (error) {
        return next(error);
    }
    res.redirect('/login');
}

async function onLogin(req, res, next) {
    function createUserSession(req, user, cbAction) {
        req.session.uid = user._id.toString();
        req.session.isAdmin = user.isAdmin;
        req.session.save(cbAction);
    }

    const enteredUser = new UserModel(req.body);
    let existingUser;

    try {
        existingUser = await enteredUser.getCurrentInDB();
    } catch (error) {
        return next(error);
    }

    if (existingUser &&
        await enteredUser.hasMatchingPasswords(existingUser.password)) {
        return createUserSession(req, existingUser, () => {
            res.redirect('/');
        });
    }

    sessionFlash.flashDataToSession(
        req,
        {
            errorMessage:
                `Invalid credentials - please 
                 double-check your email and password`,
            email: enteredUser.email,
            password: enteredUser.password,
        },
        () => {
            res.redirect('/login');
        });
}

function logout(req, res) {
    function destroyUserAuthSession(req) {
        req.session.uid = null;
        req.session.isAuthentificated = false;
        req.session.cart = null;
    }

    destroyUserAuthSession(req);
    res.redirect('/login');
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    postSignup: onSignup,
    postLogin: onLogin,
    logout: logout,
};
