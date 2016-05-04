var model = require('../models/model');

function Controller()
{
    
}

Controller.prototype.allState = function(req,res)
{
    model.getAllState(function(err,data)
    {
        res.send({err:err,data:data});
    });
}

Controller.prototype.airportState = function(req,res)
{
    model.getAirportState({airport_name:req.params.airport},function(err,data)
    {
        res.send({err:err,data:data});
    });
}

Controller.prototype.airportReviews = function(req,res)
{
    model.getAirportReviews({airport_name:req.params.airport},function(err,data)
    {
        res.send({err:err,data:data});
    });
}

Controller.prototype.updateData = function(req,res)
{
    
}

module.exports = exports = new Controller();
