const mongoose 		= require( 'mongoose' )
const validator	 	= require( 'validator' )
const bcrypt  		= require( 'bcryptjs')
const jwt			= require( 'jsonwebtoken' )
const Task 			= require( './task')
const sharp			= require( 'sharp' )

const userSchema = new mongoose.Schema( { 
	name : {
		type  : String , 
		required : true,
		trim : true
	},
	email :{
		type 		: String,
		unique		: true,
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
	},
	tokens : [{
		token :{
			type : String,
			required : true
		}
	}],
	avatar : {
		type : Buffer
	}
} , {
	timestamps : true
}  )

userSchema.methods.generateAuthToken = async function( ) {
	const user 		= this
	const token 	= jwt.sign( { '_id' : user.id } , 'thisistriarun' )
	user.tokens 	= user.tokens.concat( { token } )
	await user.save( )
	return token
}

userSchema.methods.toJSON = function( ){
	const user = this
	const userObject = user.toObject ( )
	delete userObject.password
	delete userObject.tokens
	delete userObject.avatar
	return userObject
}

userSchema.statics.findByCredentials = async ( email , password ) =>{
	const user = await userModel.findOne( { email } )

	if( !user ){
		throw new Error( 'Unable to login' )
	}
	
	const newPass = await bcrypt.hash( password , 8 )
	
	const isMatched = await bcrypt.compare( password , user.password )

	if( !isMatched ){
		throw new Error( 'Unable to login again' )
	}
	return user
}

userSchema.virtual( 'tasks' , {
	ref : 'Task' , 
	localField : '_id'  , 
	foreignField : 'owner'
} )



userSchema.pre( 'save' , async function ( next ) {
	const user = this

	if( user.isModified( 'password' ) ){
		user.password = await bcrypt.hash( user.password , 8 )
	}

	next( )
})

userSchema.pre( 'remove' , async function( next ) { 
 	const user = this
 	await Task.deleteMany( { owner : user._id } )
 	next( )
 })

const userModel = mongoose.model( 'User' , userSchema ) 

module.exports = userModel