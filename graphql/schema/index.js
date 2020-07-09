const { buildSchema } = require('graphql');
module.exports =  buildSchema(`

type User {
    _id: ID!
    oAuthProvider: String!
    oAuthId: Int
    givenName: String!
    familyName: String!
    email: String!
    phone: Int
    password: String
    picture: String
    lastIp: String
    createdAt: String!
    updatedAt:  String!
}

type AuthData {
    message: String!
    token: String!
    expireIn: Int!
}

input UserInput {
    firstname: String!
    lastname: String!
    email: String!
    gender: String
    password: String!
    lastIp: String    
}

type RootQuery {
    login(email: String!, password: String!): AuthData
    google(access_token: String!): AuthData
}

type RootMutation {
    createUser(userInput: UserInput): AuthData 
}

schema {
query:RootQuery
mutation:RootMutation
}
`);