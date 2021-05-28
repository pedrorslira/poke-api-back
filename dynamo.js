const AWS = require("aws-sdk");
require("dotenv").config();
AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = " "; //coloque o nome da tabela
const TABLE_POKEMON_INDEX = " "; //coloque o nome do index

const createPokemon = async (pokemon) => {
  const params = {
    TableName: TABLE_NAME,
    Item: pokemon,
  };
  return await dynamoClient.put(params).promise();
};

const getPokemon = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const pokemon = await dynamoClient.scan(params).promise();
  return pokemon;
};

const getPokemonById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  };
  return await dynamoClient.get(params).promise();
};

const getPokemonByName = async (name) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: TABLE_POKEMON_INDEX,
    KeyConditionExpression: "pokeName = :pokeName",
    ExpressionAttributeValues: {
      ":pokeName": name,
    },
  };
  return await dynamoClient.query(params).promise();
};

const deletePokemon = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  };
  return await dynamoClient.delete(params).promise();
};

module.exports = {
  dynamoClient,
  createPokemon,
  getPokemon,
  getPokemonById,
  getPokemonByName,
  deletePokemon,
};
