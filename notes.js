// graphQL only two categories instead of four 
// Queries: Queries are how we perform GET requests and ask for data from a GraphQL API.
// Mutations: Mutations are how we perform POST, PUT, 
// ..and DELETE requests to create or manipulate data through a GraphQL API.

// graphQL needs type definitions and resolvers
// example of type and resolvers
const typeDefs = gql`
  type Query {
    helloWorld: String
  }
`;

const resolvers = {
    Query: {
      helloWorld: () => {
        return 'Hello world!';
      }
    }
  };
  
  module.exports = resolvers;

// graphQL - /graphql for express.js server   npm run watch to test
// .. nodemon command  monintors changes to restart the server 
// ..localhost:3001/graphql
// ..graphQL playground = insomnia for graphQL 

// exampmle query and resolver
type Query {
    thoughts: [Thought]
  }


// first exapmle does not work , second will
  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
  }
// second 
  query {
    thoughts {
      _id
      username
      thoughtText
      createdAt
    }
  }

const resolvers = {
    Query: {
      thoughts: async () => {
        return Thought.find().sort({ createdAt: -1 });
      }
    }
  };


// define thoughts query that it could receive the pararment username with string data type
  type Query {
    thoughts(username: String): [Thought]
  }

//   if username exists, we set params to an object with a username key set to that value 
// .. otherwise return an empty object
  thoughts: async (parent, { username }) => {
    const params = username ? { username } : {};
    return Thought.find(params).sort({ createdAt: -1 });
  },
// for the above , enter query in playground as follows
query {
    # find a username from your previous query's results and paste it in for `<username-goes-here>` (i.e. "Wilton18")
    thoughts(username: "<username-goes-here>") {
      username
      thoughtText
    }
  }

// A resolver can accept 4 arguemnts in the following order
// parent - hold more complicated actions and reference to nested resolver functions
// args - an object of all values passed into a query or mutation requests as parameters
// context - hold data accessible by all resolvers such as logged in user status or API access token
// info - contains extra information about an operation's current state

// example query
query {
    thoughts {
      _id
      username
      thoughtText
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }

// example of queries to retrieve a single thought by id and single user by username
type Query {
    users: [User]
    // the ! indicates to carry out this query, the data must exist 
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }
// example of building a custom data type for user
type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

//   resolver for the above
// place this inside of the `Query` nested object right after `thoughts` 
thought: async (parent, { _id }) => {
    return Thought.findOne({ _id });
  }

// query example of thoughts 
query {
    # query all thoughts
    thoughts {
      _id
      username
      thoughtText
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  
    # query a single thought, use the `_id` value of a thought that returned from a previous query
    thought(_id: "<thought-id-here>") {
      _id
      username
      thoughtText
      createdAt
      reactions {
        username
        reactionBody
      }
    }
  }

//   all queries
query {
    # get all users
    users {
      username
      email
    }
  
    # get a single user by username (use a username from your database)
    user(username: "<username-goes-here>") {
      username
      email
      friendCount
      thoughts {
        thoughtText
      }
      friends {
        username
      }
    }
  
    # query all thoughts
    thoughts {
      _id
      username
      thoughtText
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  
    # query a single thought (use an _id from a thought in your database)
    thought(_id: "<thought-id-here>") {
      _id
      username
      thoughtText
      createdAt
      reactions {
        username
        reactionBody
      }
    }
  }

//   query variables api request
query getSingleUser($username: String!) {
    user(username: $username) {
      username
      friendCount
      thoughts {
        thoughtText
        createdAt
      }
      friends {
        username
      }
    }
  }

// mutation query 
mutation addUser($username: String!, $password: String!, $email: String!) {
    addUser(username: $username, password: $password, email: $email) {
      _id
      username
      email
    }
  }
  // query variables pane using json
  {
    "username": "tester2",
    "password": "test12345",
    "email": "test2@test.com"
  }

// jwt token 21.2.4