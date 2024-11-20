import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import "dotenv/config";
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import errorHandler from './utils/errorHandler';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(errorHandler);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});