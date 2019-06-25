const mongoose = require( 'mongoose' )
const validator = require( 'validator' )


mongoose.connect( process.env.MONGODB_URL , {
	useNewUrlParser : true , 
	useCreateIndex : true ,
	useFindAndModify : false
} )

/*const userModel = mongoose.model( 'User' ,  { 
	name : {
		type  : String , 
		required : true,
		trim : true
	},
	email :{
		type 		: String,
		required 	: true ,
		trim 		: true,
		lowercase	: true,
		validate( value ){
			if( !validator.isEmail( value ) ){
				throw new Error( 'Please provide valid mail' )
			}
		}
	},
	password : {
		type 		: String , 
		required 	: true,
		
		minlength 	: 7 , 
		validate( value ){
			if( value.includes( 'password' ) ){
				throw new Error( 'Cannot have passowrd in password')
			}
		} 

	},
	age : {
		type : Number,
		default :0 , 
		validate( value ){
			if( value < 0 ){
				throw new Error( 'value cannot be negative' )
			}
		}
	}
} ) 

const user = new userModel( {
	name : 'Chirag' ,
	email : 'Chirag@gmail.com   ' ,
	age : 24,
	password : '21019600'
} )

user.save( ).then( (  ) =>{
	console.log( user )
} ).catch( ( error ) =>{
	console.log( 'Hell broke loose !!' )
})*/

/*const task_model = mongoose.model( 'Task' , {
	description : {
		type 		: String,
		trim 		: true,
	},
	completed : {
		type : Boolean
	}
})

const Task  = new task_model( {
	description : 'Node js course',
	completed : false
} ) ;

Task.save( ).then( () =>{
	console.log( Task )
}).catch( (error ) =>{
	console.log( error )
})*/