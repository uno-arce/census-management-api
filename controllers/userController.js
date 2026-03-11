const bcrypt = require('bcryptjs')
const auth = require('../auth')
const prisma = require('../lib/prisma.js')

module.exports.registerUser = async (req, res) => {
	// username should be unique
	const isUsernameUnique = await prisma.user.findUnique({
		where: { username: req.body.username }
	})
	if(isUsernameUnique) {
		return res.status(400).send({ error: 'User is already registered'})
	}


	// username should be compose of string and number/symbols
	const reqUsername = +req.body.username // converts string to number
	if(!isNaN(reqUsername)) {
		return res.status(400).send({ error: 'Invalid username'})
	}

	// username should contain atleast one character and number
	const alphanumericRegex = /[a-zA-Z0-9]/;
	if(!alphanumericRegex.test(req.body.username)) {
		return res.status(400).send({ error: 'Invalid username'})

	}

	// password should contain a string and atleast one symbol and number
	const passwordHasNumber = /\d/;
	const passwordHasSymbol = /[^\w\s]/;
	if(!passwordHasNumber.test(req.body.password) || !passwordHasSymbol.test(req.body.password)) {
		return res.status(400).send({ error: 'Password must contain atleast one symbol and number'})
	}

	// password should be atleast 6 characters
	if(req.body.password.length <= 6) {
		return res.status(400).send({ error: "Password must be atleast 6 characters"})
	}

	else {
		const newUser = await prisma.user.create({
			data: {
				username: req.body.username,
				password: bcrypt.hashSync(req.body.password, 10)
			}
		})
		.then((user) => res.status(200).send({
			message: 'User registered successfully', 
			username: user.username, 
			_id: user._id
		}))
		.catch(err  => res.status(500).send({ error: 'Error in Saving'}))
	}
}

module.exports.loginUser = async (req, res) => {
	try {
		// user should be registered to the app
		const user = await prisma.user.findUnique({
			where: {  username: req.body.username }
		})
		if(!user) {
			return res.status(400).send({ error: 'User is not registered'})
		}


		// password should be correct
		if(!bcrypt.compareSync(req.body.password, user.password)) {
			return res.status(400).send({ error: 'Incorrect username or password'})
		}

		const token = auth.createAccessToken(user, res)

		return res.status(200).send({ message: "User login successfully", token})
	} catch(err) {
		console.log(err)
		res.status(500).send({ error: 'Error on logging in' })
	}
}

module.exports.logoutUser = (req, res) => {
	try {
		return res.status(200).send({ message: 'User logged off successfully' })
	} catch(err) {
		return res.status(400).send({ error: 'Logout unsuccessful'})
	}
}

module.exports.changePassword = async (req, res) => {
	try {
		const userId = req.user.id 

		const user = await prisma.user.findUnique({
			where: { id: userId }
		})

		if(!bcrypt.compareSync(req.body.oldPassword, user.password)) {
			return res.status(400).send({ error: 'Current password Incorrect' })
		}

		// password should contain a string and atleast one symbol and number
		const passwordHasNumber = /\d/;
		const passwordHasSymbol = /[^\w\s]/;
		if(!passwordHasNumber.test(req.body.newPassword) || !passwordHasSymbol.test(req.body.newPassword)) {
			return res.status(400).send({ error: 'Password must contain atleast one symbol and number'})
		}

		// password should be atleast 6 characters
		if(req.body.newPassword.length <= 6) {
			return res.status(400).send({ error: "Password must be atleast 6 characters"})
		}

		await prisma.user.update({
			where: { id: userId },
			data: { password: bcrypt.hashSync(req.body.newPassword, 10) }
		})

		return res.status(200).send({ message: 'Password updated successfully' })
	} catch(err) {
		return res.status(500).send({ error: 'Error updating password' })
	}
}

module.exports.getUserHistory = async (req, res) => {
	try {
		const userId = req.user.id

		const userData = await prisma.user.findUnique({
			where: { id: userId },
			include: {
				history: true
			}
		})

		if(userData.history.length === 0) {
			return res.status(400).send({ error: 'User history is empty' })
		}


		return res.status(200).send(userData.history)
	} catch(err) {
		console.log(err)
		return res.status(500).send({ message: 'Error getting user history' })
	}
}