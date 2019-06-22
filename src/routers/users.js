const express 	= require( 'express' )
const router 	= express.Router( )
const userModel = require( '../models/user' )
const auth		= require( '../middleware/auth')

router.post( '/user' , async ( req , res ) =>{
	
	try{
		const user = new userModel( req.body )
		const token = await user.generateAuthToken( )
		//await user.save( )
		res.status( 201 ).send( { user , token } )
	}catch ( error ) {
		res.status( 400 ).send( error )
	}	
})


router.get( '/users/me' , auth , async ( req , res ) =>{
	try{
		
		//const users = await userModel.find( {} ) 
		res.status( 201 ).send( req.user )
 
	} catch( error ){
		
		res.status( 500 ).send( error )
	}

})


router.patch( '/user/me' , auth , async( req ,res ) =>{
	const updates 			= Object.keys( req.body )
	const allowedUpdates 	= [ 'name' , 'email' , 'password' , 'age' ]

	const isValidOperation 	= updates.every( ( update ) => allowedUpdates.includes( update ) )


	if( !isValidOperation){
		return res.status( 400 ).send( { 'error' : 'Not Valid Operation' })
	}

	try{
		
		const user = req.user
		updates.forEach( ( update ) => user[ update ] = req.body[ update ] )
		
		user.save( ) 
		res.send( user )

	}catch( error ){
		 res.status( 400 ).send( error  )
	}


})

router.delete( '/user/me' , auth ,  async( req , res ) =>{
	try{
		await req.user.remove( )
		res.status( 201 ).send( req.user )
	}catch( error ){
		res.status( 400 ).send( error )
	}
} )

router.post( '/user/login' , async ( req , res ) =>{
	try{
		const user  = await userModel.findByCredentials( req.body.email , req.body.password )
		const token = await user.generateAuthToken( )
		res.status( 200 ).send( { user : user, token } )
	}catch( e ) {
		res.status( 400 ).send( "Unable to login ")
	}
})

router.post( '/user/logout' , auth , async( req , res ) =>{
	try{
		req.user.tokens = req.user.tokens.filter( ( token ) =>{ 
			return token.token !== req.token
		} )

		await req.user.save( )
		res.status( 204 ).send( req.user )
	}catch( e ){
		res.status( 501 ).send( )
	} 
})

router.post( '/user/logoutAll' , auth , async( req , res ) =>{
	try{
		req.user.tokens = [ ] 
		await req.user.save( )
		res.status( 200 ).send( 'Logged Out of All Sessions' )
	}catch( error ){
		res.status( 500 ).send( )
	}

})


module.exports = router