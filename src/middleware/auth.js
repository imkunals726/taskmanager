const jwt = require( 'jsonwebtoken' )
const User = require( '../models/user' )


const auth = async( req , res , next )=>{
	try{
	const token 	= req.header( 'Authorization' ).replace( 'Bearer ' , '' )
	const decoded 	= await jwt.verify( token , 'thisistriarun' )
	const user 		= await User.findOne( { '_id' : decoded._id , 'tokens.token' : token } )
	
	if( !user ){
		throw new Error( 'Unable to login')
	}

	req.user 	= user
	req.token 	= token

	next( )
	}catch( e){
		res.status(401).send( e )
	}
}

module.exports = auth