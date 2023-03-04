require('dotenv').config()
const AWS = require('aws-sdk')

const ENDPOINT = process.env.API_ENDPOINT
const client = new AWS.ApiGatewayManagementApi({endpoint: ENDPOINT})
const names = {};
const participants = {
  bot: {
    name: 'BOT',
    nickColor: 'red',
    id: 'bot'
  }
}

const { Configuration, OpenAIApi } = require("openai");

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

const sendToBot = async (ids, mess) => {
    
    let res = await runCompletion(mess);
    
    let message = {
      fromBot: true, 
      message: res,
      from: {
        name: 'Bot'
      }
    }
    const all = ids.map(i => sendToOne(i, message));
    
    return Promise.all(all);
};

const sendToOne = async (id, body) => {
    try {
        await client.postToConnection({
            'ConnectionId': id,
            'Data':Buffer.from(JSON.stringify(body))
        }).promise();
    } catch (e) {
        console.log(e);
    }
};

const sendToAll = async (ids, body) => {
    console.log("BODY:", body)
    const all = ids.map(i => sendToOne(i, body));
    return Promise.all(all);
};

const sendListMembers = async () => {
  const all = Object.keys(participants).map(i => sendToOne(i, {members: getAllParticipants().filter(participant => participant.id !== participants[i].id)}));
  return Promise.all(all);
}

const getAllParticipants = () => {
  return Object.keys(participants).map(id => ({
    ...participants[id],
  }));
}

exports.handler = async(event) => {
    console.log(event)
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
        
        switch(routeKey){
            case '$connect':
                break;
            case '$disconnect':
                await sendToAll(Object.keys(participants), {systemMessage: true, message: `${participants[connectionId]?.name} acabou de sair.`});
                delete names[connectionId];
                delete participants[connectionId];
                await sendListMembers();
                break;
            case '$default':
                break;
            case 'setName':
                names[connectionId] = body.name;
                participants[connectionId] = body.userConnected
                await sendListMembers();
                await sendToAll(Object.keys(participants), {systemMessage: true, message: `${participants[connectionId].name} acabou de entrar.`});
                break;
            case 'sendPublic':
                await sendToAll(Object.keys(participants),{
                  message: `${body.message}`,
                  from: {
                    id: connectionId,
                    ...participants[connectionId]
                  }
                });
                break;
            case 'sendBot':
                await sendToAll(Object.keys(participants),{
                  message: `${body.message}`,
                  from: {
                    ...participants[connectionId]
                  }
                });
                await sendToBot(Object.keys(participants), body.message);
                break;
            case 'sendPrivate':
                const to = Object.keys(participants).find(key => participants[key].id === body.to.id);
                await sendToAll([to, connectionId],{                  
                  privateMessage: true, 
                  message: `${body.message}`,
                  to: {
                    ...participants[to]
                  },
                  from: {
                    ...participants[connectionId]
                  }
                });
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
