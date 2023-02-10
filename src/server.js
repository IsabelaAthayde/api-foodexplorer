require('express-async-errors');
const express = require('express');

const AppError = require('./utils/AppError');

const app = express();
app.use(express.json());

const routes = require('./routes/index')

const migrationRun = require('./database/sqlite/migrations')

app.use(routes);

migrationRun();

app.use(( error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message,
        });
    }

    console.error(error);

    return response.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
});

const PORT = 3333;
app.listen(PORT, () => console.log("rodando"));