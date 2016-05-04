var mysql      = require('mysql');
var fs = require("fs");
var sqlConfig = require("../configs/sqlConfig");
var connection = mysql.createConnection(sqlConfig.mysql_config);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err);
    process.exit(1);
  } 
});


// Trancate Table
function trancateTable(callback)
{
    databaseSqlQuery = "TRUNCATE "+sqlConfig.table;
    connection.query(databaseSqlQuery, function(errSql, sqlQueryResult) 
    {
        callback(errSql,sqlQueryResult);
    });   
}

// Execute any sql query
exports.executeSqlQuery = function(params,callback)
{
    try
    {
        params.sql = params.sql.replace("[table]",sqlConfig.table);
        connection.query(params.sql, function(err, result) 
        {
            callback(err,result);
        });
    }
    catch(exception)
    {
       callback(exception,null); 
    } 
}


// syncfunction to check if database/table is exist
exports.sync=function(callback)
{
    try
    {
       
        checkIfDatabseAndTableIsExist(function(err,data)
        {
            if(err || !data.database_exist || !data.table_exist)
            {
                createDatabaseAndTable(function(errCreate,result)
                {
                    if(!errCreate)
                    {
                        console.log("INFO >> Database "+sqlConfig.database+" has been created successfully");
                        console.log("INFO >> Table "+sqlConfig.table+" has been created successfully");
                        callback(null,true);
                    }
                    else
                    {
                        console.log("ERR >> Cannot create Database "+sqlConfig.database);
                        console.log("ERR >> Cannot create table  "+sqlConfig.table);
                        console.log("ERR >> Date: ",new Date());
                        console.log("EXCEPTION DETAILS",errCreate);
                        callback(errCreate,false);
                    }
                    
                }); 
            }
            else
            {
                //console.log("Database exist");
                // SELECT DB
                selectDatabase(function(err,status)
                {
                    if(!err)
                        callback(null,true); 
                    else
                        callback(err,false);
                });
                    
            } 
        });
    }
    catch(sqlConnectException)
    {
        console.log("sqlConnectException",sqlConnectException);
    }
}

// Save CSV Converted data into sql table
exports.saveCsvDataIntSql = function(params,callback)
{  
   var sql ="INSERT INTO "+sqlConfig.table+" (airport_name,link,title,author,author_country,date,content,experience_airport,date_visit,type_traveller,overall_rating,queuing_rating,terminal_cleanliness_rating,terminal_seating_rating,terminal_signs_rating,food_beverages_rating,airport_shopping_rating,wifi_connectivity_rating,airport_staff_rating,recommended) VALUES ? ";
   
    try
    {
        trancateTable(function(errTrancate,result)
        {
            if(!errTrancate)
            {
                connection.query(sql,[params.data], function(err, result) 
                {
                    callback(err,result);
                });      
            }
            else
            {
                callback(errTrancate,null);
            }
              
        });
        
    }
    catch(exception)
    {
       callback(exception,null); 
    } 
}

// Function to create dreamline database & airport table
// Parameters : callback function with two parameters (ReadScriptErr/SqlError, Sql/readScript Result)
function createDatabaseAndTable(callback)
{
    try
    {
        //
        
        fs.readFile(sqlConfig.script_path, function(errReadSqlScript, createSqlQuery) {
            if(!errReadSqlScript && createSqlQuery)
            {
                    createSqlQuery= createSqlQuery.toString().replace(new RegExp("<%db_name%>", 'g'),sqlConfig.database).replace(new RegExp("<%table_name%>", 'g'),sqlConfig.table);
                    connection.query(createSqlQuery, function(errSql, sqlQueryResult) {
                        callback(errSql, sqlQueryResult);
                    });             
            }
            else
            {
                callback(errReadSqlScript,createSqlQuery);
            }
        });
    }
    catch(exception)
    {
        callback(exception,null);
    }
}

// Function to check if database/table is exist 
// parameters callback function with two parameters (error,object-> database_exist status, table_exist status,database name, table name)
function checkIfDatabseAndTableIsExist(callback)
{
    try
    {
        databaseSqlQuery = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '"+sqlConfig.database+"'";
        connection.query(databaseSqlQuery, function(errSql, sqlQueryResult) 
        {
            if(!errSql && sqlQueryResult != null && sqlQueryResult.length>0)
            {
                // Lets Check If Airport Table is exist
                tableSqlQuery = "SELECT * FROM information_schema.tables WHERE table_schema = '"+sqlConfig.database+"' AND table_name = '"+sqlConfig.table+"' LIMIT 1;"
                connection.query(databaseSqlQuery, function(errSqlTable, sqlQueryResultTable) 
                {
                    if(!errSqlTable)
                    {
                        // Table Exist
                        callback(errSqlTable,{database_exist:true,table_exist:true,database_name:sqlConfig.database,table_name:sqlConfig.table});
                    }
                    else
                    {
                        // Table Does not exist
                        callback(errSqlTable,{database_exist:true,table_exist:false,database_name:sqlConfig.database,table_name:"not set"});
                    }
                });
            }
            else
            {
                callback(errSql,{database_exist:false,table_exist:false,database_name:"not set",table_name:"not set"});           
            }
        });
    }
    catch(exception)
    {
        callback(exception,{database_exist:false,table_exist:false,database_name:"not set",table_name:"not set"}); 
    }
}

function selectDatabase(callback)
{
    selectDbQuery = "USE "+sqlConfig.database+";";
    connection.query(selectDbQuery, function(errSelectDb, resultSelectDb) 
    {
        callback(errSelectDb, resultSelectDb)
    });
}


