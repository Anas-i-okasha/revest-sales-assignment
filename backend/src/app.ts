import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes';
import productRouter from './routes/product.route';
import SalesOrderRoute from './routes/salesOrder.route';
import session from 'express-session';

const app = express();

app.use(express.json());

app.use(cors());

app.use(
	session({
		name: 'sid',
		secret: process.env.SESSION_SECRET || 'dev-secret',
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 1000 * 60 * 60, // 1 hour
		},
	}),
);

/***** Register Routers  *******/
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/sales-order', SalesOrderRoute);

/**********************  */

export default app;
