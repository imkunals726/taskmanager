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




router.get( '/tasks' , auth ,  async ( req , res ) =>{
	
	const match = {}
	const sort = {}
	if( req.query.sortBy ){
		const parts = req.query.sortBy.split( ":" )
		sort[ parts[ 0 ] ] = parts[ 1 ] === "desc" ? -1 : 1
	}
	if( req.query.completed ){
		match.completed = req.query.completed === "true"
	}
	try{
	
		// const tasks = await taskModel.find( { owner : req.user._id } )

		await req.user.populate( {
			path : 'tasks' ,
			match ,
			options : {
				limit : parseInt( req.query.limit ),
				skip  : parseInt( req.query.skip ),
				sort  
			}
		} ).execPopulate( )
		res.status( 201 ).send( req.user.tasks )
	
	} catch (error) {
	
		res.status( 500 ).send( error )
	
	}
})





router.get( '/task/:id' , auth ,  async( req , res )=>{
	
	try{
		const task = await taskModel.findOne( { _id: req.params.id  , owner : req.user._id } )

		if( !task ){
			return res.status( 404 ).send( task )
		}
		res.status( 201 ).send( task )
	} catch( error ) {
		console.log( error )
		res.status( 500 ).send( error)
	}		

})


router.patch( '/task/:id' , auth ,  async( req , res ) =>{
	const updates 			= Object.keys( req.body )
	const allowedUpdates 	= [ 'completed' , 'description' ]

	const isValidOperation 	= updates.every( ( update ) => allowedUpdates.includes( update ) ) 

	if( !isValidOperation ){
		console.log( "not allowed")
		return res.status( 400 ).send( {"error" : "Invalid Operation" } )
	}


	try{
		const task = await taskModel.findOne( { _id : req.params.id , owner : req.user._id } )
		
		if( !task ){
			return res.status( 404 ).send( 'No task found' )
		}
		//const task = await taskModel.findById( req.params.id )
		updates.forEach( ( update ) => task[ update ] = req.body[ update ] )
		
		console.log( task )
		await task.save( )
		
		if( !task ){
			return res.status( 404 ).send( )
		}
		res.status( 201 ).send( task )
	}catch( error ){
		
		return res.status( 400 ).send( error )
	}
})




router.delete( '/task/:id' ,  auth , async ( req , res )=>{
	try{
		const task = await taskModel.findOneAndDelete( { _id : req.params.id , owner : req.user._id } )
		if( !task ){
			return res.status( 404 ).send( )
		}
		res.status( 201 ).send( task )
	}catch( error ){
		res.status( 400 ).send( error )
	}
})


module.exports = router