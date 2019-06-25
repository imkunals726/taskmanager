const mongoose = require( 'mongoose' )
const validator = require( 'validator' )

const taskSchema = new mongoose.Schema( {
	description : {
		type 		: String,
		trim 		: true,
		required 	: true
	},
	completed : {
		type 		: Boolean,
		required	: true,
		default		: false
	}, 
	owner : {
		type 		: mongoose.Schema.Types.ObjectId,
		required 	: true,
		ref			: 'User'
	}
}, {
	timestamps : true
} )



taskSchema.pre( 'save' , async function( next ){
	console.log( 'saving task' )
	next( )
})

const taskModel = mongoose.model('Task' ,taskSchema );


module.exports = taskModel