const express = require('express')
const bodyParser = require('body-parser')
const {WebhookClient} = require('dialogflow-fulfillment');
const sheetdb = require("sheetdb-node");
const client = sheetdb({ address: '8jb1q0tui9ikn' });

const app = express()
app.use(bodyParser.json())
const port = process.env.PORT || 3000

app.post('/dialogflow-fulfillment', (request, response) => {
    dialogflowFulfillment(request, response)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

const dialogflowFulfillment = (request, response) => {
    const agent = new WebhookClient({request, response})

    function sayHello(agent){
        agent.add("hi, this response is coming from heroku")
    }
    
    function saveToDB(agent) {
        const rate = request.body.queryResult.parameter.value1;
        client.create({ name: "William", age: 25 }).then(function(data) {
    console.log(data);}, function(err){console.log(err);});
        agent.add("Finish storing rating.")
    }

    let intentMap = new Map();
    intentMap.set("testintent", sayHello)
    intentMap.set("end.conversation - rating", saveToDB)
    agent.handleRequest(intentMap)

}
