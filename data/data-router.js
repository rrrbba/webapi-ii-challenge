const router = require('express').Router();

const Posts = require('./db.js');


//CREATES A NEW POST
router.post('/', (req, res) => {
    const newPost = req.body;

    if (!newPost.title || !newPost.contents){
        return res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
    }
    Posts.insert(newPost)
    .then(post => {
        res.status(201).json(post);
    })
    .catch(err => {
        res.status(500).json({ error: "There was an error while saving the post to the database."})
    })
});

//CREATES A NEW COMMENT
router.post("/:id/comments", (req, res) => {
    const id = req.params.id;
    const comment = {...req.body, post_id: id};

    if (!comment.text) {
        return res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } 

    Posts.findById(id) //check to ensure the post with id given exists
    .then(post => {
        if (post.length) { //add comment after checking id
            Posts.insertComment(comment)
            .then(data => {
                res.status(201).json(comment)
            })
        } else { //if the id doesn't exist return this
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "There was an error while saving the comment to the database." })
    })
})

//GETS ALL POSTS
router.get('/', (req, res) => {
    Posts.find()
    .then(posts => {
        res.json(posts)
    })
    .catch(err => {
        res.status(500).json({ error: "The posts information could not be retrieved."})
    })
});

//GETS POST BY ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    
    if(!id) {
        return res.status(404).json({ message: "The post with the specified ID does not exist."})
    }
    Posts.findById(id)
    .then(posts => {
        res.json(posts);
    })
    .catch(err => {
        res.status(500).json({ error: "The post information could not be retrieved."})
    })
});

//GETS COMMENTS BY POST ID
router.get('/:id/comments', (req, res) => {
    const id = req.params.id;

    if(!id) {
       return res.status(400).json({ message: "You didn't provide an ID."})
    }
    Posts.findPostComments(id) //flip the find comments with the post. Should just check if the post exists first 
    .then(comments => {
        if(!commments.length){
            return res.status(404).json({ message: "No comments!"})
        }
        Posts.findById(id)
        .then(id => {
            if(id){
                res.status(200).json(comments)
            } else{
                res.status(404).json({ message: "You didn't give a valid ID.", id: id})
            }
        })
    })
    .catch(err => {
        res.status(500).json({ error: "The comments information could not be retrieved."})
    })
});

//REMOVES A POST BY ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    Posts.remove(id)
    .then(post => {
        if(!post) {
            return res.status(404).json({ message: "The post with the specified ID does not exist."})
        } else {
            res.status(200).json(post);
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post could not be removed"})
    })
});

//UPDATES THE POST BY ID
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    console.log(req.body);
    console.log(changes);

    if(!changes.title || !changes.contents){
        return res.status(400).json({ message: "Bad contents."})
    }
    Posts.update(id, changes)
    .then(post => {
        if(!post) {
            return res.status(404).json({ message: "The post with the specified ID does not exist.", id: post})
        } else {
            Posts.findById(id)
            .then(updPost => {
                res.status(200).json(updPost)
            })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post information could not be modified."})
    })
})

module.exports = router;