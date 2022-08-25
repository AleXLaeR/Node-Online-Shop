function getSessionData(req) {
    const sessionData = req.session.flashedData;
    req.session.flashedData = null;
    return sessionData;
}

function flashDataToSession(req, data, cbAction) {
    req.session.flashedData = data;
    req.session.save(cbAction);
}

module.exports = {
    getSessionData: getSessionData,
    flashDataToSession: flashDataToSession,
}
