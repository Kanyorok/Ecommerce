const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');

//setting up config file
dotenv.config({path: 'backend/config/config.env'})


// connecting to database
connectDatabase();


const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} node.`)
})

//Handle unhandled promise rejections
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled promise rejection');
    // Close server & exit process
    server.close(() => process.exit(1));
})