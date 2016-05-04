// api
var express = require('express');
var apiRoutes = require('./routes/route');
var app = express();
var ioHelper = require("./libs/ioHelper");

app.use(function(req,res,next)
{
    ioHelper.ioMiddleWare(function(err,status)
    {
        if(err || !status)
            res.send({err:err,status:status});
        else
            next(); 
    });
});
app.use('/api/', apiRoutes);

app.listen(9003, function() {
    console.log('Express server listening on port 9003');
});

