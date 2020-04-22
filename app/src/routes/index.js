const express = require('express');
const router = express.Router();

const db = require('../database/models');

/* GET home page. */
router.get('/', async function(req, res, next) {
	let users = await db.User.findAll({ include: ['posts'] });
	res.render('index', { title: 'Express', users });
});

router.get('/post', async (req, res) => {
	let posts = await db.Post.findAll({ include: ['user'] });
	res.send(posts);
});

router.get('/delete/:id', async (req, res) => {
	await db.User.destroy({
		where: {
			id: req.params.id
		}
	});
	res.send('Ok, deleted');
})

module.exports = router;
