require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const Connection = require('./libs/connections')

let connection

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion(message) {

    const completion  = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        temperature: 0.5,
        max_tokens: 3500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    console.log(completion.data.choices[0].text)

    return completion.data.choices[0].text
}

const sendToBot = async (id, mess, event) => {
    const participant = connection.connections[id]
    const messageForBot = `Olá, meu nome é ${participant?.name}, ${mess}`
    let res = await runCompletion(messageForBot);
    
    let message = {
      fromBot: true,
      privateMessage: true,
      message: res,
      from: connection.connections.bot,
      to: participant
    }
    
    return connection.publishToAll(event, message)
};

exports.handler = async(event) => {
    if(event.requestContext){
        const connectionId = event.requestContext.connectionId;
        const routeKey = event.requestContext.routeKey;
        
        let body = {};
        try{
            if(event.body){
              body = JSON.parse(event.body);
            }
        }catch (err){
            console.log(err);
        }

        if (!connection) {
          connection = new Connection({})
          connection.init(event)
        }
        
        switch(routeKey){
            case '$connect':
                break;
            case '$disconnect':
                await connection.publishToAll(event, {systemMessage: true, message: `${connection.connections[connectionId]?.name} acabou de sair.`})
                await connection.removeConnection(connectionId)
                await connection.sendListMembers()
                break;
            case '$default':
                break;
            case 'setName':
              console.log('$SETNAME', event)
                await connection.addConnection(connectionId, body.userConnected)
                await connection.publishToAll(event, {systemMessage: true, message: `${body.userConnected.name} acabou de entrar.`})
                await connection.sendListMembers()
                break;
            case 'sendPublic':
                await connection.publishToAll(event, {
                  message: `${body.message}`,
                  from: {
                    id: connectionId,
                    ...connection.connections[connectionId]
                  }
                })
                break;
            case 'sendBot':
                console.log('$sendBot', event)
                break;
            case 'sendPrivate':
                const to = Object.keys(connection.connections).find(key => connection.connections[key].id === body.to.id);
                const payload = {                  
                  privateMessage: true, 
                  message: `${body.message}`,
                  to: {
                    ...connection.connections[to]
                  },
                  from: {
                    ...connection.connections[connectionId]
                  }
                }

                await Promise.all([
                  connection.publish(connectionId, payload),
                  connection.publish(to, payload),
                ])

                if(to === 'bot') await sendToBot([connectionId], body.message);

                break;
            default:
        }
    }
    
    
    
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
