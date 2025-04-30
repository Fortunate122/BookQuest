import express, { Application } from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { fileURLToPath } from 'url';
import { typeDefs, resolvers } from './schemas/index.js';
import { contextMiddleware } from './utils/auth.js';
import mongoose from 'mongoose';

const app: Application = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startApolloServer() {
  console.log('🔄 Starting Apollo Server...');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  console.log('✅ Apollo Server started');

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));

  app.use(
    '/graphql',
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => contextMiddleware({ req })
    })
  );
  console.log('✅ Middleware applied');

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  console.log('🌐 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');
  console.log('✅ MongoDB connected, launching Express...');
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
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
