const { Client, Phone, db } = require('../../db/models/models');
const router = require('express').Router();
//const util = require('util');
/* const cors = require('cors');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type'],
    exposedHeaders: ['Content-Range']
};
router.use(cors(corsOptions));
router.options('*', cors(corsOptions)); */
/**
 * Will return a json response of the Client Model with
 * an attribute of phones for the Phone Model.
 */



router.get('/', (req, res) => {
    /* if (Object.keys(req.query).length !== 0) {
        Client.findAll({ include: [Phone] })
            .then((clients) => {
                if (!clients) res.send("No clients");
                res.setHeader('X-Total-Count', clients.length);
                res.header('Access-Control-Expose-Headers', 'X-Total-Count');
                res.json(clients);
            })
    } */
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

    console.log(req.query.phone, req.query)

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
            res.setHeader('client/list', );
            res.json([...data]);
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

router.post('/', (req, res) => {
    return db.transaction((t) => {
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


router.get('/:id', (req, res) => {
    Client.findById(req.params.id, {include: [Phone]})
    .then((data) => res.json(data));
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

router.put('/edit/:id', (req, res) => {
    Client.findById(req.params.id, {include: [Phone]})
        .then((client) => {
            client = Client.build(req.body);
            db.transaction((t) => {
                const phones = Phone.build(client.phones);
                client.phones = phones;
                const setPhones = client.phones;

                return Promise.all([client.save(), setPhones]);
            })
            .then(() => res.send("Task Completed"))
            .catch((err) => res.send({"message": "Error Occured", err}));
        })
    /* return db.transaction((t) => {
        Client.findById(req.params.id, {include: [Phone]})
            .then((client) => {
                const phones = Phone.build(updateClient.phones);
                delete updateClient.phones;
                client = Client.build(updateClient);
                return client
                    .save()
                    .then((updatedClient) => {
                        if (updatedClient) phones.save().catch((err) => res.json(err));
                    })
                    .catch((err) => res.json(err));
            });
        })
        .catch((err) => res.send(err)); */
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
    return db.transaction((t) => {
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

module.exports = router;

/* const updateClientTable = Client.update({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        date_of_joining: req.body.date_of_joining,
        end_date: req.body.end_date,
        height: req.body.height,
        weight: req.body.weight,
        package: req.body.package,
        blood_group: req.body.blood_group,
        paid: req.body.paid,
        balance: req.body.balance,
        address: req.body.address,
        food_habit: req.body.food_habit,
        ref: req.body.ref,
        looking_for: req.body.looking_for,
        visit: req.body.visit,
    }, {
        where: {
            id: req.params.id
        }
    });

    const updatePhoneTable = Phone.update({
        phoneType: req.body.phones.phoneType,
        phoneNumber: req.body.phones.phoneNumber
    }, {
        where: {
            clientId: req.params.id
        }
    });

    Promise.all([updateClientTable, updatePhoneTable])
        .then((data) => res.json(data)) */