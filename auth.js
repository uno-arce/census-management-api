const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

// Secret Keyword
const secret = process.env.SECRET

// Token Creation
module.exports.createAccessToken = (user) => {
	const data = {
		id: user.id,
		username: user.username
	}
	
	const token = jwt.sign(data, secret, {})

	return token
} 

// Token Verification
module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization

	if(!token ) {
		return res.status(400).send({ auth: 'Failed. No Token'} )
	}

	jwt.verify(token, secret, function(err, decodedToken) {
		if(err) {
			return res.status(403).send({
				auth:  'Failed',
				message: 'err.message'
			})
		} else {
			req.user = decodedToken
			next()
		}
	})
}