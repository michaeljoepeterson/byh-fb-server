const admin = require('firebase-admin');

const checkAuth = async (req,res,next) => {
	if(req.headers.authtoken){
		try{
			await admin.auth().verifyIdToken(req.headers.authtoken);
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