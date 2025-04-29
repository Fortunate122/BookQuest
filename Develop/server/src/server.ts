import express, { Application } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { typeDefs, resolvers } from './schemas';
import { contextMiddleware } from './utils/auth';
import db from './config/connection';

const app: Application = express();
const PORT = process.env.PORT || 3001;

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => contextMiddleware({ req })
  }));
  

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/build')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/build/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
}

startApolloServer();




// import express from 'express';
// import { ApolloServer } from 'apollo-server-express';
// import path from 'path';
// import { typeDefs, resolvers } from './schemas';
// import { contextMiddleware } from './utils/auth';
// import db from './config/connection';

// const app = express();
// const PORT = process.env.PORT || 3001;

// async function startApolloServer() {
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context: contextMiddleware,
//   });

//   await server.start();
//   server.applyMiddleware({ app });

//   app.use(express.urlencoded({ extended: false }));
//   app.use(express.json());

//   if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../../client/build')));

//     app.get('*', (req, res) => {
//       res.sendFile(path.join(__dirname, '../../client/build/index.html'));
//     });
//   }

//   db.once('open', () => {
//     app.listen(PORT, () => {
//       console.log(`API server running on port ${PORT}!`);
//       console.log(`GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
//     });
//   });
// }

// startApolloServer();


// import express from 'express';
// import path from 'node:path';
// import db from './config/connection.js';
// import routes from './routes/index.js';

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });
