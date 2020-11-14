const admin = require('firebase-admin');
const {User} = require('../models/user');

const checkAuth = async (req,res,next) => {
	if(req.headers.authtoken){
		try{
			const decodedToken = await admin.auth().verifyIdToken(req.headers.authtoken);

			let user = new User();
			let {email,name} = decodedToken;
			let {project} = req;
			user.email = email;
			user.project = project;
			if(name){
				let splitName = name.split(' ');
				user.firstName = splitName[0];
				user.lastName = splitName[1];
			}
			req.user = user;

			next();
		}
		catch(e){
			console.log('auth error: ',e);
			res.status(422);
			return res.json({
				message:'Unauthorized'
			});
		}
	}
	else{
		res.status(422);
		return res.json({
			message:'Unauthorized'
		});
	}
}

module.exports = {checkAuth};