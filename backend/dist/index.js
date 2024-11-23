"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const interview_route_1 = __importDefault(require("./routes/interview.route"));
const candidate_route_1 = __importDefault(require("./routes/candidate.route"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-production-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(errorHandler_1.default);
app.use('/api/v1/auth', auth_route_1.default);
app.use('/api/v1/user', user_route_1.default);
app.use('/api/v1/interview', interview_route_1.default);
app.use('/api/v1/candidate', candidate_route_1.default);
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
