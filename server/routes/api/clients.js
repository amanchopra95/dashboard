const models = require('../../db/models');
//const Client = require('../../db/models/client');
//const Phone = require('../../db/models/phone');
const router = require('express').Router();
const passport = require('../../passport/passport');
//const util = require('util');
const Client = models.client;
const Phone = models.phone;

/**
 * Will return a json response of the Client Model with
 * an attribute of phones for the Phone Model.
 */


router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (Object.keys(req.query).length === 0) {
        models.client.findAll({ include: [Phone] })
            .then((clients) => {
                if (!clients) res.send("No clients");
                res.setHeader('X-Total-Count', clients.length);
                res.header('Access-Control-Expose-Headers', 'X-Total-Count');
                res.json(clients);
            })
    }
    if (req.query.q) {

        Client.findAndCountAll({
            order: [[req.query._sort, req.query._order]],
            offset: +req.query._start,
            limit: +req.query._end,
            where: {
                id: +req.query.q
            }
        })
        .then((clients) => {
            if (!clients) res.send("No clients");
            const promise = clients.rows.map((client) => {
                return Phone.findAll({
                    where: {
                        clientId: client.id
                    }
                })
                    .then((data) => {
                        client = client.toJSON();
                        client.phones = data;
                        return client;
                    })
            });
            Promise.all(promise)
                .then((value) => {
                    res.setHeader('X-Total-Count', clients.count);
                    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
                    res.json(value);
                });
        });
    }

    if (req.query.phone) {
        Phone.findOne({
            where: {
                phoneNumber: req.query.phone
            }
        })
        .then((phone) => {
            Client.findAll({
                where: {
                    id: phone.clientId
                },
                order: [[req.query._sort, req.query._order]],
                offset: +req.query._start,
                limit: +req.query._end
            })
                .then((client) => {
                    //client = client.toJSON();
                    client.phones = phone;
                    res.setHeader('X-Total-Count', client.length);
                    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
                    res.json(client);
                });
        });
    }

    Client.findAndCountAll({
        order: [[req.query._sort, req.query._order]],
        offset: +req.query._start,
        limit: +req.query._end,
    })
        .then((clients) => {
            if (!clients) res.send("No clients");
            const promise = clients.rows.map((client) => {
                return Phone.findAll({
                    where: {
                        clientId: client.id
                    }
                })
                .then((data) => {
                    client = client.toJSON();
                    client.phones = data;
                    return client;
                })
            });
            Promise.all(promise)
                .then((value) => {
                    res.setHeader('X-Total-Count', clients.count);
                    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
                    res.json(value);
                });
        });

    /* const filter = JSON.parse(req.query.filter);
    const range = JSON.parse(req.query.range);
    const sort = JSON.parse(req.query.sort); 

    if (Object.keys(filter).length !== 0) {
        Client.findAndCountAll({ order: [[sort[0], sort[1]]], offset: +range[0], limit: +range[1] + 1, include: [Phone], where: {id : +filter.q} })
            .then((data) => {
                if (!data) res.send("No data");
                res.setHeader('Content-Range', util.format("clients %d-%d/%d", range[0], range[1], data.count));
                res.header("Access-Control-Expose-Headers", "Content-Range");
                res.json(data.rows);
            });
    }

    Client.findAndCountAll({ order: [[sort[0], sort[1]]], offset: +range[0], limit: +range[1] + 1, include: [Phone] })
        .then((data) => {
            if (!data) res.send("No data");
            res.setHeader('Content-Range', util.format("clients %d-%d/%d", range[0], range[1], data.count));
            res.header("Access-Control-Expose-Headers", "Content-Range");
            res.json(data.rows);
        }); */


});

router.get('/list', (req,res) => {
    Client.findAll({include: [Phone]})
        .then((data) => {
            if (!data) res.send("No data");
            //res.setHeader('client/list', );
            res.json(data);
        })
})

/* router.get('/phones', (req, res) => {
    Phone.findAll()
        .then((phones) => {
            if (!phones) res.json({ "message": "No phone number" });
            res.header('Content-Range', `client 0-9/${data.length}`);
            res.header("Access-Control-Expose-Headers", "Content-Range");
            res.json(phones);
        });
}); */

/**
 * Using Transactions to target both the models Phone and Client
 * If any of the Promise gets reject, transaction will auto-magically
 * call rollback which will remove the initial entry to database.
 */

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    return models.sequelize.transaction((t) => {
        return Client.create(req.body, {include: [Phone]}, {transaction: t})
            .then((client) => {
                if (!client) throw new Error('Problem');
                res.json(client);
            });
    })
    .catch((err) => {
        console.log(err);
        res.redirect('back');
    });
});


/**
 * @param {id} clientId
 * @return json of client data
 */


router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Client.findById(req.params.id, {include: [Phone]}).then((data) => res.json(data));
})


/**
 * searching through number 
 * @param String 
 * @return JSON of the phone Number
 */
/* router.get('/number/:number', (req, res) => {
    Phone.findOne({
        where: {
            phoneNumber: req.params.number
        }
    })
    .then((phone) => {
        if (!phone) res.send('Does not exist')
        res.json(phone.clientId);
    });
}); */

/**
 * searching through SNo 
 * @param String 
 * @return JSON of the phone Number
 */

router.get('/SNo/:id', (req, res) => {
    Client.findOne({
        where: {
            SNo: req.params.id
        }
    })
    .then((client) => {
        res.json(client)
    });
});



/**
 * Update the Client and Phone Model using transactions
 * @param id
 * @return Boolean
 */

router.put('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const clientData = req.body;
    const phoneData = clientData.phones;

    Client.findById(req.params.id, {include: [Phone]})
    .then((client) => {
        const phoneDelta = getDelta(client.phones, phoneData);
        if (!client) throw new Error("Client Not Found");

        return models.sequelize.transaction((t) => {

            return Promise.all([
                phoneDelta.added.map(phone => {
                    phone.clientId = client.id; //Add FK client Id before inserting to db.
                    return Phone.create(phone, { transaction: t });
                }),
                phoneDelta.changed.map(changedPhoneData => {
                    const phone = phoneData.find(_phone => _phone.id === changedPhoneData.id);
                    console.log(phone);
                    return Phone.update(phone, {where: {id: phone.id}}, { transaction: t });
                }),
                phoneDelta.deleted.map(phone => {
                    return phone.destroy({ transaction: t });
                })
            ])
                .then((value) => {
                    client.update(req.body, { transaction: t });
                })
                .catch((err) => res.json(err));
        })
            .then((updatedClient) => {
                if (!updatedClient) res.send("Success");
                res.json(updatedClient);
            })
            .catch((err) => {
                console.log(err);
                res.json(err);
            });
    });

    
});

/* router.patch('/update/phoneNumber/:id', (req, res) => {
    Phone.update({
        phoneNumber: req.body.phoneNumber
    },{
        where: {
            id: req.params.id
        }
    })
    .then((data) => {
        res.json(data);
    })
}) */

router.put('/add/phone/:id', (req, res) => {
    return models.sequelize.transaction((t) => {
        return Client.findById(req.params.id, {include: {model : [Phone]}})
            .then((client) => {
                
            })
    })
});

router.delete('/delete/:id', (req, res) => {
    Client.destroy({
        where: {
            SNo: req.params.id
        }
    })
    .then((value) => {
        res.json(value);
    });
});

function getDelta (source, updated) {
    let added = updated.filter(updatedItem => source.find(sourceItem => sourceItem.id === +updatedItem.id) === undefined);
    console.log("Added",added);
    let changed = source.filter(sourceItem => updated.find(updatedItem => +updatedItem.id === sourceItem.id) !== undefined);
    console.log("Changed", changed);
    let deleted = source.filter(sourceItem => updated.find(updatedItem => +updatedItem.id === sourceItem.id) === undefined);
    console.log("Deleted", deleted);
    const delta = {
        added: added,
        changed: changed,
        deleted: deleted
    };

    return delta;
}

module.exports = router;
