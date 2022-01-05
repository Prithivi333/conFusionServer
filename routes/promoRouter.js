const express = require('express');
const bp = require('body-parser');
const mongoose = require('mongoose');
const authenticate=require('../authenticate');

const Promos = require('../models/promotions');
const { findByIdAndRemove } = require('../models/promotions');

const promoRouter = express.Router({ mergeParams: true });

promoRouter.use(bp.json());

promoRouter.route('/')
    .get((req, res, next) => {
        Promos.find({})
            .then((promos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promos);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req, res, next) => {
        //console.log(req.body);
        //return res.statusCode(200);
        Promos.create(req.body.promotions[0])
            .then((promo) => {
                console.log("Promotion created ", promo);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req, res, next) => {
        Promos.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promos.findById(req.params.promoId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /promotions/' + req.params.promoId);
    })
    .put(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req, res, next) => {
        Promos.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin,(req, res, next) => {
        Promos.findByIdAndRemove(req.params.promoId)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = promoRouter;