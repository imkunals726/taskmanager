const express 	= require( 'express' )

const app 		= express( )

/*const multer	= require( 'multer' )
const upload	= multer( {
	'dest' : 'images'
} )*/



require( './db/mongoose' )

const userrouter 	= require('./routers/users' )
const taksrouter 	= require( './routers/task' )

/*app.post( '/upload' , upload.single( 'upload' ), ( req, res )=>{
	res.send( )
})
*/

app.use( express.json( ) )
app.use( userrouter )
app.use( taksrouter )

const port = process.env.PORT

app.listen( port , ( )=>{
	console.log( 'Server is up... on ' + port  )
})

const bcrypt = require( 'bcryptjs' )

