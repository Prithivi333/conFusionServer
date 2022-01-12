const express = require('express');
const bp = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router({ mergeParams: true });

favoriteRouter.use(bp.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.statusCode(200); })
    .all(authenticate.verifyUser)
    .get((req, res, next) => {
        Favorites.find({ 'user': req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                if (!favorites) {
                    var err = new Error("No favorites included");
                    err.statusCode = 404;
                    return next(err);
                }
                else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorites);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    for (var i = 0; i < req.body.length; i++) {
                        if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                            favorite.dishes.push(req.body[i]._id);
                        }
                    }
                    favorite.save()
                        .then((favorite) => {
                            console.log('Favorite Created ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err));
                }
                else {
                    Favorites.create({ "user": req.user._id, "dishes": req.body })
                        .then((favorite) => {
                            console.log('Favorite Created ', favorite);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /favorites');
    })
    .delete(cors.corsWithOptions, (req, res, next) => {
        // Favorites.find({})
        //     .then((favorites) => {
        //         var favToRemove;
        //         if (favorites) {
        //             favToRemove = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
        //         }
        //         if (favToRemove) {
        //             favToRemove.remove()
        //                 .then((result) => {
        //                     res.statusCode = 200;
        //                     res.setHeader("Content-Type", "application/json");
        //                     res.json(result);
        //                 }, (err) => next(err));

        //         } else {
        //             var err = new Error('You do not have any favorites');
        //             err.status = 404;
        //             return next(err);
        //         }
        //     }, (err) => next(err))
        //     .catch((err) => next(err));
        Favorites.findOneAndRemove({ "user": req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        // Favorites.find({})
        //     .populate('user')
        //     .populate('dishes')
        //     .then((favorites) => {
        //         if (favorites) {
        //             const favs = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
        //             const dish = favs.dishes.filter(dish => dish.id === req.params.dishId)[0];
        //             if (dish) {
        //                 res.statusCode = 200;
        //                 res.setHeader("Content-Type", "application/json");
        //                 res.json(dish);
        //             } else {
        //                 var err = new Error('You do not have dish ' + req.params.dishId);
        //                 err.status = 404;
        //                 return next(err);
        //             }
        //         } else {
        //             var err = new Error('You do not have any favorites');
        //             err.status = 404;
        //             return next(err);
        //         }
        //     }, (err) => next(err))
        //     .catch((err) => next(err));
        res.statusCode = 403;
        res.end('GET operation not supported on /favorites/' + req.params.dishId);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,
        (req, res, next) => {
            //     Favorites.find({})
            //         .then((favorites) => {
            //             var user;
            //             if (favorites)
            //                 user = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
            //             if (!user)
            //                 user = new Favorites({ user: req.user.id });
            //             if (!user.dishes.find((d_id) => {
            //                 if (d_id._id)
            //                     return d_id._id.toString() === req.params.dishId.toString();
            //             }))
            //                 user.dishes.push(req.params.dishId);

            //             user.save()
            //                 .then((userFavs) => {
            //                     res.statusCode = 201;
            //                     res.setHeader("Content-Type", "application/json");
            //                     res.json(userFavs);
            //                     console.log("Favorites Created");
            //                 }, (err) => next(err))
            //                 .catch((err) => next(err));

            //         })
            //         .catch((err) => next(err));
            Favorites.findOne({ user: req.user._id })
                .then((favorite) => {
                    if (favorite) {
                        if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                            favorite.dishes.push(req.params.dishId)
                            favorite.save()
                                .then((favorite) => {
                                    console.log('Favorite Created ', favorite);
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                }, (err) => next(err))
                        }
                    }
                    else {
                        Favorites.create({ "user": req.user._id, "dishes": [req.params.dishId] })
                            .then((favorite) => {
                                console.log('Favorite Created ', favorite);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }, (err) => next(err))
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /favorites/:dishId');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        // Favorites.find({})
        //     .then((favorites) => {
        //         var user;
        //         if (favorites)
        //             user = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
        //         if (user) {
        //             user.dishes = user.dishes.filter((dishid) => dishid._id.toString() !== req.params.dishId);
        //             user.save()
        //                 .then((result) => {
        //                     res.statusCode = 200;
        //                     res.setHeader("Content-Type", "application/json");
        //                     res.json(result);
        //                 }, (err) => next(err));

        //         } else {
        //             var err = new Error('You do not have any favorites');
        //             err.status = 404;
        //             return next(err);
        //         }
        //     }, (err) => next(err))
        //     .catch((err) => next(err));
        Favorites.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    index = favorite.dishes.indexOf(req.params.dishId);
                    if (index >= 0) {
                        favorite.dishes.splice(index, 1);
                        favorite.save()
                            .then((favorite) => {
                                console.log('Favorite Deleted ', favorite);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            }, (err) => next(err));
                    }
                    else {
                        err = new Error('Dish ' + req.params.dishId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }
                else {
                    err = new Error('Favorites not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;