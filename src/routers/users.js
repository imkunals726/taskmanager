const express 	= require( 'express' )
const router 	= express.Router( )
const userModel = require( '../models/user' )
const auth		= require( '../middleware/auth')
const multer	= require( 'multer' )
const sharp		= require( 'sharp' )

const { sendWelcomeEmail , sendCancellationEmail }  = require( '../emails/account')

const upload 	= multer( { 
	limits 	: {
		fileSize	:  1000000
	},
	fileFilter( req , file , cb ){
		if( !file.originalname.match( "\.(jpg|jpeg|png)$" ) ){
			return cb( new Error( 'Please upload a image file' ) )
		}
		cb( undefined , true )	
		/*cb( new Error( 'Please upload an image' ) )
		cb( undefined , true )*/
	}
} )

router.post( '/user' , async ( req , res ) =>{
	
	try{
		const user = new userModel( req.body )
		const token = await user.generateAuthToken( )
		sendWelcomeEmail( user.email  , user.name )
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
		sendCancellationEmail( req.user.email , req.user.name )
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

router.post( '/user/me/avatar' , auth ,  upload.single( 'avatar' ) , async( req , res ) =>{
	// req.user.avatar = req.file.buffer
	const avatar = await sharp( req.file.buffer ).resize( { widht : 250 , height : 250 } ).png( ).toBuffer( )
	req.user.avatar = avatar
	await req.user.save( )
	res.send( ) 
} , ( error  , req , res , next ) =>{
	res.status( 400 ).send( { error : error.message } )
} ) 

router.delete( '/user/me/avatar' , auth , async( req , res ) =>{
	req.user.avatar = undefined
	await req.user.save( )
	res.send( )
})
router.get( '/user/:id/avatar' , async( req , res ) =>{
	try{
		const user = await userModel.findById( req.params.id )
		if( !user || !user.avatar ){
			throw new Error( 'No Avatar or user found' )
		}

		res.set( 'Content-Type' , 'image/png' )
		res.status( 200 ).send( user.avatar )
	}catch( error ){
		res.status( 400 ).send( {error : error })
	}
})

module.exports = router