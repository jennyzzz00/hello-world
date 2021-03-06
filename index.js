'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Major') {
				sendGenericMessage(sender)
				continue
			}
			if (text === 'Hello') {
				sendTextMessage(sender, "How can I help you?")
				continue
			}
		        if (text === 'Thanks') {
				sendTextMessage(sender, "You're welcome! Would you like our agent contact you to better assist you?")
				continue
			}
			 if (text === 'Financial aid') {
				sendTextMessage(sender, "Receive up to $5,775 in Federal Pell Grants, if you qualify")
				continue
			}
			 if (text === 'Call center hours') {
				sendTextMessage(sender, "Our agent will call you within 9am EST to 5pm EST hours")
				continue
			}
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})


const token = "EAALFMaX6ry0BAHHWQvrJ5aKPXDcJ9xPd6YgLMQp2yAbkwrTK4aZAmEVZBZAnkl9PGujW1Ei5BSXaiTmJMHL6GXUWd3DB9DPZBjIv2ZB7eNSWt6GCNsasZAhDmAPOigZAZAJ3T26KMZBRrN4OaAXaaHSsA9IulQrfhtpOgw60PZCUTnyNp1PAXKW4rA"

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "Art&Design",
					"subtitle": "Areas of Interest",
					"image_url": "https://raw.githubusercontent.com/jennyzzz00/hello-world/master/ArtDesign.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Business",
					"subtitle": "Areas of Interest",
					"image_url": "https://raw.githubusercontent.com/jennyzzz00/hello-world/master/Business.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

