const router = require('express').Router();
const { Phone } = require('../../db/models/models');


router.get('/', (req, res) => {
    Phone.findAll()
        .then((phones) => {
            if (!phones) res.json({ "message": "No phone number" });
            res.setHeader('X-Total-Count', phones.length);
            res.header('Access-Control-Expose-Headers', 'X-Total-Count');
            res.json(phones);
        });
});

router.get('/:id', (req, res) => {
    Phone.findOne({
        where: {
            phoneNumber: req.params.id
        }
    })
        .then((phone) => {
            if (!phone) res.send('Does not exist')
            res.setHeader('X-Total-Count', phones.length);
            res.header('Access-Control-Expose-Headers', 'X-Total-Count');
            res.json(phone.clientId);
        });
})

router.get('/number/:number', (req, res) => {
    Phone.findOne({
        where: {
            phoneNumber: req.params.number
        }
    })
        .then((phone) => {
            if (!phone) res.send('Does not exist')
            res.json(phone.clientId);
        });
});

router.patch('/update/phoneNumber/:id', (req, res) => {
    Phone.update({
        phoneNumber: req.body.phoneNumber
    }, {
            where: {
                id: req.params.id
            }
        })
        .then((data) => {
            res.json(data);
        })
});

module.exports = router;