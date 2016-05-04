var sqlHelper = require("../libs/mysqlHelper");
var ioHelper = require("../libs/ioHelper");

exports.getAllState=function(callback)
{
    try
    {
        var allStateSqlQuery = "SELECT airport_name,count(id) no_of_reviews FROM [table] GROUP BY airport_name ORDER BY no_of_reviews DESC";
         sqlHelper.executeSqlQuery({sql:allStateSqlQuery},function(err,data)
         {
            callback(err,data);  
         });
    }
    catch(exception)
    {
        callback(exception,null);
    }
}

exports.getAirportState=function (params,callback) {
    
    try
    {
        //aalborg-airport
        var airportStateSqlQuery = "SELECT airport_name,count(id) no_of_reviews,avg(overall_rating) overall_rating,sum(recommended) recommendations from [table] where airport_name='"+params.airport_name+"'";
         sqlHelper.executeSqlQuery({sql:airportStateSqlQuery},function(err,data)
         {
            callback(err,data);  
         });
    }
    catch(exception)
    {
        callback(exception,null);
    }
}

exports.getAirportReviews = function (params,callback) {
    
    try
    {
        //aalborg-airport
        var airportReviewsSqlQuery = "SELECT overall_rating,recommended recommendation,date,author_country,content from [table] where airport_name='"+params.airport_name+"' order by date desc";
         sqlHelper.executeSqlQuery({sql:airportReviewsSqlQuery},function(err,data)
         {
            callback(err,data);  
         });
    }
    catch(exception)
    {
        callback(exception,null);
    }
}