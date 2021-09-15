const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const { uuid } = require('uuidv4');
const AWS = require("aws-sdk");
const eventbridge = new AWS.EventBridge()

const tableName = process.env.USER_TABLE;

exports.putUserHandler = async (event) => {

    const body = JSON.parse(event.body)
    const userData = {id: uuid(), name: body.name, email: body.email}

    var dynamoDBparams = {
        TableName: tableName,
        Item: userData
    };

    // Store the user data in the dynamoDB table
    const result = await docClient.put(dynamoDBparams).promise();

    const eventBridgeParam = {
        Entries: [
            {
                // Event envelope fields
                Source: 'com.users',
                EventBusName: 'default',
                DetailType: 'UserCreated',
                Time: new Date(),

                // Main event body
                Detail: JSON.stringify(userData)
            },

        ]
    }

    // Send the UserCreated event
    await eventbridge.putEvents(eventBridgeParam).promise()

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    return response;
}
