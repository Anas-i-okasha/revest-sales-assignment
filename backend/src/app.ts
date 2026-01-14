import express from 'express';
// import { join } from 'path';
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

// const angularDistPath = join(__dirname, '../../frontend/dist/frontend');

// app.use(express.static(angularDistPath));

// app.get(/^\/(?!api).*/, (req, res) => {
// 	res.sendFile(join(angularDistPath, 'index.html'));
// });

export default app;
