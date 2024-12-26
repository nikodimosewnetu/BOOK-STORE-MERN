import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import booksRoute from './routes/booksRoute.js';
import userRoute from './routes/userRoute.js';

dotenv.config();

const app = express();


app.use(express.json());


app.use(cors());

app.get('/', (req, res) => {
  res.status(234).send('Welcome To MERN Stack Tutorial');
});

app.use('/books', booksRoute);
app.use('/user', userRoute);

// Use the correct MongoDB URL from the environment variable
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log('App connected to database');
    app.listen(process.env.PORT || 5555, () => {
      console.log(`App is listening on port ${process.env.PORT || 5555}`);
    });
  })
  .catch((error) => {
    console.log('Error connecting to database:', error.message);
  });
