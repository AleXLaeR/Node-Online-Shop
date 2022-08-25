const express = require('express');

const router = express.Router();

router.get('/403', (req, res) => {
    res.status(403).render('shared/403');
})
router.use((err, req, res, next) => {
    res.status(500).render('shared/500');
});
router.use((req, res) => {
    res.status(404).render('shared/404');
});

module.exports = router;
