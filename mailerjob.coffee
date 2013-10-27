nodemailer = require "nodemailer"

cronJob = require('cron').CronJob


transport = nodemailer.createTransport("SES",
    AWSAccessKeyID: process.env.AWS_AccessKey
    AWSSecretKey: process.env.AWS_SecretKey
)

mailOptions =
    from: "cpn585@gmail.com"
    to: "cpn585@gmail.com"
    subject: "Glean Update"
    text: "You are awesome"

new cronJob '* 1 * * * *', (()  ->
    transport.sendMail mailOptions, (error, response) -> (
        if error
            console.log error
        else
            console.log "Message sent " + response.message)
    
    transport.close())
, null, true, "America/Los_Angeles"

