const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])
    })

});

router.post('/', authorize,  (request, response) => {

    // Endpoint to create a new post
    const media = {
        type: request.body.media.type,
        url: request.body.media.url
    }

    const post = {
        media,
        userId: request.currentUser.id,
        text: request.body.text,
    }

    PostModel.create(post, () => {
        response.status(201).json()
    })

});

router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post
    const user = request.currentUser.id;
    const post = request.params.postId;
    PostModel.like(user, post, () => {
        response.status(201).json()
    });

});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post
    const user = request.currentUser.id;
    const post = request.params.postId;
    PostModel.unlike(user, post, () => {
        response.status(201).json()
    });

});

module.exports = router;
