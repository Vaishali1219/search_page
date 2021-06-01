const express = require('express');
const path = require('path');

const app = express();

app.use(express.static('./dist/search-engine'));

app.get('/*', (req, res) => {
	res.sendFile('index.html', {root: 'dist/search-engine'})
});

app.listen(process.env.PORT || 3000);