const { MongoClient : mongo_client , ObjectId : object_id } = require( 'mongodb' )


const connection_url = 'mongodb://127.0.0.1:27017'
const database_name = 'task-manager'

mongo_client.connect( connection_url , { useNewUrlParser : true } ,( err , resp )=>{
	if (err ) {
		return console.log( 'Could not connect to ' + connection_url );
	}
	console.log( 'Connected to Mongodb' )
	const db 				= resp.db( database_name )
	
	const update_promise 	= db.collection( 'tasks' ).updateMany( { },{
	 	$set:{
	 		completed : true
	 	}
	 } )

	update_promise.then( ( result ) =>{
		console.log( result , 'Success' )
	}).catch(( error ) => {
		console.log( error , 'Error')
	})
})

