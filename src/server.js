require('express-async-errors');
const migrationRun = require('./database/sqlite/migrations');
const uploadConfig = require('./configs/upload');
const AppError = require('./utils/AppError');

const express = require('express');
const routes = require('./routes/index');

const cors = require('cors');
app.use(cors());

migrationRun();

const app = express();
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

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