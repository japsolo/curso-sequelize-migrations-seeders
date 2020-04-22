const express = require('express');
const router = express.Router();

const db = require('../database/models');

/* GET users listing. */
router.get('/:id', async (req, res) => {
	let user = await db.User.findByPk(
		req.params.id,
		{
			attributes: {
				exclude: ['deletedAt', 'createdAt', 'updatedAt']
			},
			include: ['posts']
		}
	);
	res.json(user);
});

module.exports = router;
