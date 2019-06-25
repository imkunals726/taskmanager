const sgMail = require( '@sendgrid/mail')

sgMail.setApiKey( process.env.SENDGRID_API_KEY )

const sendWelcomeEmail = ( email , name ) =>{
	sgMail.send( {
		to 		: email,
		from 	: 'kunals726@gmail.com',
		subject : 'Welcome to Kunals726 Web app',
		text	: `welcome to the app, ${name}. Let me know how you get along with the app.`
	} )
}

const sendCancellationEmail = ( email , name  ) =>{

	sgMail.send( { 
		to 		: email , 
		from 	: 'kunals726@gmail.com',
		subject	: `GoodBye ${name}. Hope we will see you soon`,
		text	: `GoodBye ${name}. Do you there was anything that ticked you off . If you can provide your valueable feedback we can improve upon that`
	} )
}

module.exports = { 	sendWelcomeEmail , 
					sendCancellationEmail }