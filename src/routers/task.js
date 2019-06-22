const express 	= require( 'express' )
const router 	= express.Router( ) 
const auth		= require( '../middleware/auth')
const taskModel = require( '../models/task' )
router.post( '/task' , auth , async ( req , res ) =>{

	//const task = new taskModel( req.body )
	const task = new taskModel( {
		...req.body,
		owner : req.user._id
	} )
	try{
		await task.save( )
		res.status( 201 ).send( task );
	}catch( error ){
		res.status( 400 ).send( error )
	}

})




router.get( '/tasks' , async ( req , res ) =>{
	
	try{
	
		const tasks = await taskModel.find( {} )
		res.status( 201 ).send( tasks )
	
	} catch (error) {
	
		res.status( 500 ).send( error )
	
	}
})





router.get( '/task/:id' , auth ,  async( req , res )=>{
	
	try{
		const task = await taskModel.findOne( { _id: req.parmas.id  , owner : req.user._id } )
		if( !task ){
			return res.status( 404 ).send( task )
		}
		res.status( 201 ).send( task )
	} catch( error ) {
		res.send( error)
	}		

})


router.patch( '/task/:id' , async( req , res ) =>{
	const updates 			= Object.keys( req.body )
	const allowedUpdates 	= [ 'completed' , 'description' ]

	const isValidOperation 	= updates.every( ( update ) => allowedUpdates.includes( update ) ) 

	if( !isValidOperation ){
		return res.status( 400 ).send( {"error" : "Invalid Operation" } )
	}


	try{
		const task = await taskModel.findById( req.params.id )
		updates.forEach( ( update ) => task[ update ] = req.body[ update ] )
		
		await task.save( )
		
		if( !task ){
			return res.status( 404 ).send( )
		}
		res.status( 201 ).send( task )
	}catch( error ){
		return res.status( 400 ).send( error )
	}
})




router.delete( '/task/:id' ,  async ( req , res )=>{
	try{
		const task = await taskModel.findByIdAndDelete( req.params.id )
		if( !task ){
			return res.status( 404 ).send( )
		}
		res.status( 201 ).send( task )
	}catch( error ){
		res.status( 400 ).send( error )
	}
})


module.exports = router