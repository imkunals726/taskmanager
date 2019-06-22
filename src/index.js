const express 	= require( 'express' )

const app 		= express( )

require( './db/mongoose' )

const userrouter 	= require('./routers/users' )
const taksrouter 	= require( './routers/task' )
/*app.use( ( req , res , next ) =>{
	res.status( 503 ).send( 'Site is maintaince mode' )
})*/
app.use( express.json( ) )
app.use( userrouter )
app.use( taksrouter )

const port = process.env.PORT || 3000

app.listen( port , ( )=>{
	console.log( 'Server is up...' )
})

const bcrypt = require( 'bcryptjs' )

/*const my_function = async ( ) => {
	const password = 'kunals726'
	const hashedPassword = await bcrypt.hash( password , 8 )
	console.log( password )
	console.log( hashedPassword )
}

my_function( )*/