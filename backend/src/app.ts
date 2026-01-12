import express from 'express';
import authRouter from './routes/auth.routes';
import productRouter from './routes/product.route';
import SalesOrderRoute from './routes/salesOrder.route';

const app = express();

app.use(express.json());

/***** Register Routers  *******/

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/sales-order', SalesOrderRoute);

/**********************  */
export default app;
