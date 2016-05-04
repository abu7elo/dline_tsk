var csv = require("fast-csv");
var fs = require("fs");
var request = require("request");
var ioConfig = require("../configs/ioConfig");
var sqlHelper = require("./mysqlHelper");
var path = require("path");
// Function IO middleware to check if csv file is exist
exports.ioMiddleWare = function(callback)
{
    try
    {
        // Check csv file if not exist -> then download it
        // sync: check if database & tables is exists, otherwise create them
        // preperCsvFileToSql: format csv file to json array [mysql bulk insert operation]
        // saveCsvDataIntSql: save csv file data into mysql table
        downloadCsvFile(function(err,response)
        {
            if(!err)
            {
                sqlHelper.sync(function(errSync,syncStatus)
                {
                    if(!errSync && syncStatus)
                    {
                        preperCsvFileToSql(function(errPreper,formattedData)
                        {
                            if(!err)
                            {
                                sqlHelper.saveCsvDataIntSql({data:formattedData},function(errSave,saveStatus)
                                {
                                    if(!errSave)
                                        callback(null,true);
                                    else
                                        callback(errSave,false);
                                });     
                            }
                            else
                                callback(errPreper,false);
                               
                        });
                        
                    }
                    else
                    {
                        callback(errSync,false);
                    }
                });
            }
            else
                callback(err,false);
            
        });
    }
    catch(exception)
    {
        callback(exception,false);
    }
    
}

// Function to format CSV file response
// Parameters two (callback function(err,FormattedResult))
function preperCsvFileToSql (callback)
{
    try
    {
        
        var stream = fs.createReadStream(path.join("./",ioConfig.csv_filename));
        var newData = [];
        var count =1;

            csv
            .fromStream(stream)
            .transform(function(data){
                return data.slice(0,20); 
            })
            .on("data", function(data){
                // Skip header row                
                if(count !=1)
                    newData.push(data);
                count++; 
            })
            .on("end", function(){
                callback(null,newData);
            });
    }
    catch(exception)
    {
        callback(exception,null);
    }
}

// Download CSV file if not exist
function downloadCsvFile(callback)
{
    try
    {
        filePath = path.join("./",ioConfig.csv_filename);
        
        fs.exists(filePath, function(exists) 
        {
            if(!exists)
            {
                request(ioConfig.csv_file_url,function(err,response,body)
                {
                    console.log("File Downloaded");
                    callback(err,response);
                    
                }).pipe(fs.createWriteStream(filePath));
            }
            else
            {
                callback(null,ioConfig.filename+" File already exist");
            }
        });
    }
    catch(exception)
    {
        callback(exception,"Cannot create "+ioConfig.filename+" File");
    }
    
}