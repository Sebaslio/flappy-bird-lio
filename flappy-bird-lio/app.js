const express = require('express');
const app = express();


app.use(express.static(__dirname));

app.get('/', (req, res)=> {
    res.sendFile('/Users/sebastianleonellio/mi-porfolio-mvc/index.html')
})


app.listen(3030, () => { console.log('Server running on port 3030');

});