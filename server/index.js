
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const morgan = require('morgan');

const app = express()

app.use(helmet());
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({
	limit: '50mb'
}));

// Cors
app.use(cors());
// Allow OPTIONS for all resources
app.options('*', cors());

require('./routes/Upload')(app);


// Start server
let port = 5700;
app.listen({ port }, () => console.log(`Server  🚀 started on port ${port}`));
