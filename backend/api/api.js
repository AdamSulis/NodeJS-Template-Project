const express = require('express');
const router = express.Router();
const database = require('../sql/database.js');
const fs = require('fs/promises');

//!Multer
const multer = require('multer'); //?npm install multer
const path = require('path');
const { request } = require('http');

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, path.join(__dirname, '../uploads'));
    },
    filename: (request, file, callback) => {
        callback(null, Date.now() + '-' + file.originalname); //?egyedi név: dátum - file eredeti neve
    }
});

const upload = multer({ storage });

//!Endpoints:
//?GET /api/test
router.get('/test', (request, response) => {
    response.status(200).json({
        message: 'Ez a végpont működik.'
    });
});

//?GET /api/testsql
router.get('/testsql', async (request, response) => {
    try {
        const selectall = await database.selectall();
        response.status(200).json({
            message: 'Ez a végpont működik.',
            results: selectall
        });
    } catch (error) {
        response.status(500).json({
            message: 'Ez a végpont nem működik.'
        });
    }
});


const szavak = [];

let kitalalandoSzo = '';
let tippeltBetuk = [];
let hibak = 0;

router.get('/szavak', async(request, response) => {
   response.status(200).json(szavak)
});

router.post('/szavak', async(request, response) => {
    const szo = request.body.szavak;
    if (szavak.includes(szo)){
        response.status(400).json({
            message: 'Ez a szó már létezik'
        });
        return;
    }

    szavak.push(szo)
    

    response.status(200).json({
        message: 'Szó hozzáadva'
    });
});


router.post('/szavaktorles', async (request, response) => {
    const szo = request.body.szavak;
    const index = szavak.indexOf(szo);
    if (index === -1)
    {
        response.status(404).json({
            message: 'Ez a szó nem létezik'
        });
        return;
    }
    szavak.splice(index, 1);

    response.status(200).json({
        message: 'Szó törölve'
    });
});

router.get('/ujJatek', async (request, response) => {
    if (szavak.length === 0){
        response.status(400).json({
            message: 'Nincs szó a listában'
        });
        return;
    }

    const index = Math.floor(Math.random() * szavak.length);
    kitalalandoSzo = szavak[index];
    tippeltBetuk = [];
    hibak = 0;

    response.status(200).json({
        hossz: kitalalandoSzo.length
    });
});


router.post('/tipp', async(request, response) =>{
    const betu = request.body.betu;

    if (!tippeltBetuk.includes(betu)){
        tippeltBetuk.push(betu);

    if (!kitalalandoSzo.includes(betu))
    {
        hibak = hibak + 1;
    }
    }

    let megjelenit = '';

    for (let i = 0; i < kitalalandoSzo.length; i++){
        if (tippeltBetuk.includes(kitalalandoSzo[i])){
            megjelenit = megjelenit + kitalalandoSzo[i] + ' ';
        } else
        {
            megjelenit = megjelenit + '_ ';
        }
    }

    response.status(200).json({
        megjelenit: megjelenit,
        hibak: hibak,
        nyert: !megjelenit.includes('_'),
        vesztett: hibak >= 6
    })
})
module.exports = router;
