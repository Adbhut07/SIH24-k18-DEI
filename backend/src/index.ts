import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import "dotenv/config";
import cors from 'cors';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import errorHandler from './utils/errorHandler';
import interviewRoutes from './routes/interview.route';
import candidateRoutes from './routes/candidate.route';

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-production-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(errorHandler);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/interview', interviewRoutes);
app.use('/api/v1/candidate', candidateRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});