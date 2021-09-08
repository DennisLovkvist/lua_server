module.exports =
{
    GetCustomers: async function ()
    {
        return await Query("SELECT * FROM Customer");
    },
    GetCustomerIdFromNumber: async function (customer_number)
    {
        return await Query("select id from Customer where number = " + customer_number + ";");
    },
    GetCounts: async function ()
    {
        return await Query("SELECT * FROM Count");
    },
    GetPalletTypes: async function ()
    {
        return await Query("SELECT * FROM PalletType");
    },
    GetDepartments: async function ()
    {
        return await Query("SELECT id,name FROM Department where id != 4 And id != 5;");
    },
    StartCounting: async function (customer_id)
    {
        return await StartCounting(customer_id);
    },
    StartCountingAtDate: async function (customer_number,date_string,time_string)
    {
        return await StartCountingAtDate(customer_number,date_string,time_string);
    },
    EndCounting: async function (customer_id)
    {
        return await EndCounting(customer_id);
    },
    GetCountingByCustomerIdAndDate: async function (id,date_string)
    {
        return await GetCountingByCustomerIdAndDate(id,date_string);
    },
    GetCountingControlByDate: async function (date_string)
    {
        return await GetCountingControlByDate(date_string);
    },
    GetCountingControlByDateAndStatus: async function (date_string, status)
    {
        return await GetCountingControlByDateAndStatus(date_string,status);
    },
    GetCustomersByDate: async function (date_string)
    {
        return await GetCustomersByDate(date_string);
    },
    GetCustomerById: async function (id) {
        return await GetCustomerById(id);
    },
    UpdateCountings: async function (ids, counts)
    {
        return await UpdateCountings(ids, counts);
    },
    GetCountingControlById: async function(id)
    {
        return await GetCountingControlById(id);
    },
    UpdateCountingControlById: async function(id, status_id,done_global,done_dry,done_cold,done_frozen)
    {
        return await UpdateCountingControlById(id, status_id,done_global,done_dry,done_cold,done_frozen);
    },
    GetCompleteCountingByDate: async function (date_start,date_end)
    {
        return await GetCompleteCountingByDate(date_start,date_end);
    },
    GetCompleteTumbaCountingByDate: async function (date_start,date_end,tumba)
    {
        return await GetCompleteTumbaCountingByDate(date_start,date_end,tumba);
    },
    UpdateCountingValue: async function (counting_control_id,department,pallet_type,value)
    {
        return await UpdateCountingValue(counting_control_id,department,pallet_type,value);
    },
    GetStatuses: async function ()
    {
        return await GetStatuses();
    },
    CreateCustomer: async function (name,number,max_height,tumba)
    {
        return await CreateCustomer(name,number,max_height,tumba);
    },
    CustomerExists: async function (customer_id)
    {
        return await CustomerExists(customer_id);
    },
    CustomerNumberExists: async function (customer_number)
    {
        return await CustomerNumberExists(customer_number);
    }
};

const { Console } = require('console');
const mariadb = require('mariadb');

async function CreateCustomer(name,number,max_height,tumba)
{
    var query = "insert into Customer(name,number,max_height,tumba,locked) values('" + name + "'," + number + "," + max_height + "," + tumba + "," + false + ");";
    console.log(query);

    return await Query(query);
}
async function GetStatuses()
{
    var query = "select * from Status;";

    return await Query(query);
}
async function UpdateCountingValue(counting_control_id,department,pallet_type,value)
{
    var n = parseInt(value);

    if(!isNaN(n))
    {
        var query = "UPDATE Counting SET count = " + value + " WHERE Counting.counting_control_id = " + counting_control_id + " AND Counting.department_id = " + department + " AND Counting.pallet_type_id = " + pallet_type + ";";
        
        return await Query(query);
    }
    
    return [];
}

async function GetCompleteTumbaCountingByDate(date_start,date_end,tumba)
{
    var query = "SELECT "+
    "CountingControl.id AS counting_control_id, "+
    "CountingControl.status_id AS status_id, "+
    "CountingControl.created_date AS created_date, "+
	"Customer.id AS customer_id, "+
    "Customer.name AS customer_name, "+
    "Customer.number AS customer_number, "+
	"Customer.tumba AS customer_tumba, "+
    "Status.name AS status_name, "+
	"CountingControl.done_dry, "+
	"CountingControl.done_cold, "+
	"CountingControl.done_frozen, "+
	"CountingControl.done_global, "+
	
    "c1.count AS dry_pp, "+
    "c2.count AS dry_sp, "+
    "c3.count AS dry_hp, "+
    "c4.count AS dry_sk, "+
	
	"c5.count AS cold_pp, "+
    "c6.count AS cold_sp, "+
    "c7.count AS cold_hp, "+
    "c8.count AS cold_sk, "+
	
	"c9.count AS frozen_pp, "+
    "c10.count AS frozen_sp, "+
    "c11.count AS frozen_hp, "+
    "c12.count AS frozen_sk, "+
	
	"c13.count AS gray, "+
    "c14.count AS wood, "+
    "c15.count AS blue, "+
	"c16.count AS red "+
	
    "FROM CountingControl "+

    "LEFT JOIN Status ON CountingControl.status_id = Status.id "+
    
    "LEFT JOIN Customer ON CountingControl.customer_id = Customer.id "+

    "LEFT JOIN Counting c1 ON CountingControl.id=c1.counting_control_id AND c1.department_id=1 AND c1.pallet_type_id = 1 "+
    "LEFT JOIN Counting c2 ON CountingControl.id=c2.counting_control_id AND c2.department_id=1 AND c2.pallet_type_id = 2 "+ 
    "LEFT JOIN Counting c3 ON CountingControl.id=c3.counting_control_id AND c3.department_id=1 AND c3.pallet_type_id = 3 "+ 
    "LEFT JOIN Counting c4 ON CountingControl.id=c4.counting_control_id AND c4.department_id=1 AND c4.pallet_type_id = 4 "+ 
	
	"LEFT JOIN Counting c5 ON CountingControl.id=c5.counting_control_id AND c5.department_id=2 AND c5.pallet_type_id = 1 "+
    "LEFT JOIN Counting c6 ON CountingControl.id=c6.counting_control_id AND c6.department_id=2 AND c6.pallet_type_id = 2 "+ 
    "LEFT JOIN Counting c7 ON CountingControl.id=c7.counting_control_id AND c7.department_id=2 AND c7.pallet_type_id = 3 "+ 
    "LEFT JOIN Counting c8 ON CountingControl.id=c8.counting_control_id AND c8.department_id=2 AND c8.pallet_type_id = 4 "+ 
	
	"LEFT JOIN Counting c9 ON CountingControl.id=c9.counting_control_id AND c9.department_id=3 AND c9.pallet_type_id = 1 "+
    "LEFT JOIN Counting c10 ON CountingControl.id=c10.counting_control_id AND c10.department_id=3 AND c10.pallet_type_id = 2 "+ 
    "LEFT JOIN Counting c11 ON CountingControl.id=c11.counting_control_id AND c11.department_id=3 AND c11.pallet_type_id = 3 "+ 
    "LEFT JOIN Counting c12 ON CountingControl.id=c12.counting_control_id AND c12.department_id=3 AND c12.pallet_type_id = 4 "+ 
	
	"LEFT JOIN Counting c13 ON CountingControl.id=c13.counting_control_id AND c13.department_id=5 AND c13.pallet_type_id = 5 "+
    "LEFT JOIN Counting c14 ON CountingControl.id=c14.counting_control_id AND c14.department_id=5 AND c14.pallet_type_id = 6 "+ 
    "LEFT JOIN Counting c15 ON CountingControl.id=c15.counting_control_id AND c15.department_id=5 AND c15.pallet_type_id = 7 "+ 
    "LEFT JOIN Counting c16 ON CountingControl.id=c16.counting_control_id AND c16.department_id=5 AND c16.pallet_type_id = 8 "+
    
    "WHERE (CountingControl.created_date >= " + date_start + " AND CountingControl.created_date <= " + date_end + ")";


    var lol = tumba.split("");

    var dude = (lol[0] === "1" || lol[1] === "1" || lol[2] === "1");


    console.log(lol);

    
    console.log(dude);

    if(dude)
    {
        query += " AND (";
    }
    else
    {
        return [];
    }

    if(lol[0] === "1")
    {
        query += "Customer.tumba = 1 ";
    }
    if(lol[1] ==="1")
    {
        if(lol[0] === "1")
        {
            query += "OR ";
        }
        query += "Customer.tumba = 2 ";
    }
    if(lol[2] === "1")
    {
        if(lol[0] === "1" || lol[1] === "1" )
        {
            query += "OR ";
        }
        query += "Customer.tumba = 3 ";
    }

    if(dude)
    {
        query += ");";
    }
    else
    {
        query += ";";
    }


    return await Query(query);
}




async function GetCompleteCountingByDate(date_start,date_end)
{
    var query = "SELECT "+
    "CountingControl.id AS counting_control_id, "+
    "CountingControl.status_id AS status_id, "+
    "CountingControl.created_date AS created_date, "+
	"Customer.id AS customer_id, "+
    "Customer.name AS customer_name, "+
    "Customer.number AS customer_number, "+
    "Status.name AS status_name, "+
	"CountingControl.done_dry, "+
	"CountingControl.done_cold, "+
	"CountingControl.done_frozen, "+
	"CountingControl.done_global, "+
	
    "c1.count AS dry_pp, "+
    "c2.count AS dry_sp, "+
    "c3.count AS dry_hp, "+
    "c4.count AS dry_sk, "+
	
	"c5.count AS cold_pp, "+
    "c6.count AS cold_sp, "+
    "c7.count AS cold_hp, "+
    "c8.count AS cold_sk, "+
	
	"c9.count AS frozen_pp, "+
    "c10.count AS frozen_sp, "+
    "c11.count AS frozen_hp, "+
    "c12.count AS frozen_sk, "+
	
	"c13.count AS gray, "+
    "c14.count AS wood, "+
    "c15.count AS blue, "+
	"c16.count AS red, "+

    "TimeRapport.date_arrival as date_arrival, "+
    "TimeRapport.date_loading_start as date_loading_start, "+
    "TimeRapport.date_loading_end as date_loading_end, "+
    "TimeRapport.date_departure as date_departure, "+

    "TimeRapport.time_arrival as time_arrival, "+
    "TimeRapport.time_loading_start as time_loading_start, "+
    "TimeRapport.time_loading_end as time_loading_end, "+
    "TimeRapport.time_departure as time_departure "+
	
    "FROM CountingControl "+

    "LEFT JOIN Status ON CountingControl.status_id = Status.id "+
    
    "LEFT JOIN Customer ON CountingControl.customer_id = Customer.id "+

    "LEFT JOIN TimeRapport ON TimeRapport.counting_control_id = CountingControl.id "+

    "LEFT JOIN Counting c1 ON CountingControl.id=c1.counting_control_id AND c1.department_id=1 AND c1.pallet_type_id = 1 "+
    "LEFT JOIN Counting c2 ON CountingControl.id=c2.counting_control_id AND c2.department_id=1 AND c2.pallet_type_id = 2 "+ 
    "LEFT JOIN Counting c3 ON CountingControl.id=c3.counting_control_id AND c3.department_id=1 AND c3.pallet_type_id = 3 "+ 
    "LEFT JOIN Counting c4 ON CountingControl.id=c4.counting_control_id AND c4.department_id=1 AND c4.pallet_type_id = 4 "+ 
	
	"LEFT JOIN Counting c5 ON CountingControl.id=c5.counting_control_id AND c5.department_id=2 AND c5.pallet_type_id = 1 "+
    "LEFT JOIN Counting c6 ON CountingControl.id=c6.counting_control_id AND c6.department_id=2 AND c6.pallet_type_id = 2 "+ 
    "LEFT JOIN Counting c7 ON CountingControl.id=c7.counting_control_id AND c7.department_id=2 AND c7.pallet_type_id = 3 "+ 
    "LEFT JOIN Counting c8 ON CountingControl.id=c8.counting_control_id AND c8.department_id=2 AND c8.pallet_type_id = 4 "+ 
	
	"LEFT JOIN Counting c9 ON CountingControl.id=c9.counting_control_id AND c9.department_id=3 AND c9.pallet_type_id = 1 "+
    "LEFT JOIN Counting c10 ON CountingControl.id=c10.counting_control_id AND c10.department_id=3 AND c10.pallet_type_id = 2 "+ 
    "LEFT JOIN Counting c11 ON CountingControl.id=c11.counting_control_id AND c11.department_id=3 AND c11.pallet_type_id = 3 "+ 
    "LEFT JOIN Counting c12 ON CountingControl.id=c12.counting_control_id AND c12.department_id=3 AND c12.pallet_type_id = 4 "+ 
	
	"LEFT JOIN Counting c13 ON CountingControl.id=c13.counting_control_id AND c13.department_id=5 AND c13.pallet_type_id = 5 "+
    "LEFT JOIN Counting c14 ON CountingControl.id=c14.counting_control_id AND c14.department_id=5 AND c14.pallet_type_id = 6 "+ 
    "LEFT JOIN Counting c15 ON CountingControl.id=c15.counting_control_id AND c15.department_id=5 AND c15.pallet_type_id = 7 "+ 
    "LEFT JOIN Counting c16 ON CountingControl.id=c16.counting_control_id AND c16.department_id=5 AND c16.pallet_type_id = 8 "+
    
    "WHERE CountingControl.created_date >= " + date_start + " AND CountingControl.created_date <= " + date_end + ";"
    
    return await Query(query);
}
async function GetCountingControlByDateAndStatus(date, status)
{

    var query = "select " + 
    "CountingControl.id as id," +
    "CountingControl.status_id as status_id," +
    "Customer.id as customer_id," +
    "Customer.name as customer_name," +
    "Customer.number as customer_number," +
    "Customer.max_height as customer_max_height," +
    "Status.name as status_name," +
    "CountingControl.done_dry as done_dry," +
    "CountingControl.done_cold as done_cold," +
    "CountingControl.done_frozen as done_frozen," +
    "CountingControl.done_global as done_global " +
    "from CountingControl " +
    "inner join Customer on Customer.id = CountingControl.customer_id " + 
    "inner join Status on Status.id = CountingControl.status_id " + 
    "where CountingControl.created_date = " + date + " and CountingControl.status_id = " + status + ";"; 

    return await Query(query);
}
async function GetCountingControlByDate(date)
{

    var query = "select " + 
    "CountingControl.id as id," +
    "CountingControl.status_id as status_id," +
    "Customer.id as customer_id," +
    "Customer.name as customer_name," +
    "Customer.number as customer_number," +
    "Customer.max_height as customer_max_height," +
    "Status.name as status_name," +
    "CountingControl.done_dry as done_dry," +
    "CountingControl.done_cold as done_cold," +
    "CountingControl.done_frozen as done_frozen," +
    "CountingControl.done_global as done_global " +
    "from CountingControl " +
    "inner join Customer on Customer.id = CountingControl.customer_id " + 
    "inner join Status on Status.id = CountingControl.status_id " + 
    "where CountingControl.created_date = " + date + ";"; 

    return await Query(query);
}
const pool = mariadb.createPool
(
    {
        host: 'localhost',
        user: 'lua_application',
        password: 'raspberry',
        database: 'LUA',
        timezone: 'Europe/Stockholm',
        connectionLimit: 5
    }
);
async function UpdateCountingControlById(id, status_id,done_global,done_dry,done_cold,done_frozen)
{
    var query = "UPDATE CountingControl SET " + 
    "status_id = " + status_id + ", " +
    "done_global = " + done_global + ", " +
    "done_dry = " + done_dry + ", " +
    "done_cold = " + done_cold + ", " +
    "done_frozen = " + done_frozen + " " +
    "WHERE CountingControl.id = " + id + ";";

    return await Query(query);
}
async function UpdateCountings(ids, counts)
{
    var result = [];
    for (var i = 0; i < ids.length; i++)
    {
        var query = "UPDATE Counting SET count = " + counts[i] + " WHERE Counting.id = " + ids[i] + ";";
        var r = await Query(query);
        result.push(r);
    }
    return result;
}
async function GetCustomersByDate(date_string)
{
    var query = "select Customer.id, Customer.name, Customer.number, Customer.max_height, Customer.locked from Customer inner join Counting on Counting.customer_id = Customer.id where Counting.pallet_type_id = 4 and Counting.created_date = " + date_string + ";";
    
    var result = await Query(query);

    var values = new Array();

    result.forEach(element => values.push(element.count));

    return result;
}
async function GetCustomerById(id)
{
    var query = "select * from Customer where id = " + id + ";";

    var result = await Query(query);

    var values = new Array();

    result.forEach(element => values.push(element.count));

    return result;
}
async function GetCountingControlById(id)
{
    var query = "select * from CountingControl where id = " + id + ";";

    var result = await Query(query);

    var values = new Array();

    result.forEach(element => values.push(element.count));

    return result;
}
async function GetCountingByCustomerIdAndDate(customer_id,date_string)
{
    var query = 

        "select " +
        "Counting.id as id, Counting.count as count, " +
        "Counting.counting_control_id as counting_control_id, " +
        "Customer.id as customer_id,Customer.name as customer_name, " +
        "Department.id as department_id, Department.name as department_name, " +
        "PalletType.id as pallet_type_id, PalletType.name as pallet_type_name " +
        "from Counting " + 
        "inner join Customer on Customer.id = Counting.customer_id " +
        "inner join Department on Department.id = Counting.department_id " +
        "right join PalletType on PalletType.id = Counting.pallet_type_id " +
        "where Counting.customer_id = " + customer_id + " AND Counting.created_date = " + date_string + ";";

    
    return await Query(query);  
}
async function CustomerExists(id)
{
    var query ="select * from Customer WHERE id = " + id + ";"; 
    var rows = await Query(query);
    return (rows.length > 0);
}
async function CustomerNumberExists(number)
{
    var query ="select * from Customer WHERE number = " + number + ";"; 
    var rows = await Query(query);
    return (rows.length > 0);
}
async function StartCountingAtDate(customer_id,date_string,time_string)
{
    if (await CustomerExists(customer_id))
    {
        if (!await HasOngoingCount(customer_id, date_string))
        {
            var result = await InitializeCounting(customer_id, date_string, time_string);
            LockCustomer(customer_id, true);            
        }
        result = await GetCountingByCustomerIdAndDate(customer_id,date_string);
        return result;
    }
    else
    {
        return "[]";
    }  
}
async function StartCounting(customer_id)
{
    var date_string = GetCurrentDateString();

    if (await CustomerExists(customer_id))
    {
        if (!await HasOngoingCount(customer_id, date_string))
        {
            var result = await InitializeCounting(customer_id, date_string, '"06:00"');
            LockCustomer(customer_id, true);
        }        
        result = await GetCountingByCustomerIdAndDate(customer_id,date_string);
        return result;
    }
    else
    {
        return "[]";
    }

    

}
async function EndCounting(customer_id)
{
    LockCustomer(customer_id, false);
}



async function InitializeCounting(customer_id, date_string,time_string)
{ 
    var query_string_cc ="insert into CountingControl(customer_id,status_id,created_date,created_time,done_dry,done_cold,done_frozen,done_global)"; 

    query_string_cc += " values(" + customer_id + ",3," +  date_string + "," + time_string + ",False,False,False,False);"


    await Query(query_string_cc).then(async (res) =>     
    {    

        var counting_control_id = res.insertId;    
        var query_string_tr = "insert into TimeRapport(counting_control_id, date_arrival,date_loading_start, date_loading_end, date_departure,time_arrival,time_loading_start, time_loading_end, time_departure) values (" + counting_control_id + ",'','','','','','','','')";

        await Query(query_string_tr).then(async (res) =>     
        {    

            var query_string = "insert into Counting(count, created_date, created_time, last_changed_date, last_changed_by, committed, pallet_type_id, department_id, customer_id, counting_control_id) values";

            for (i = 1; i < 4; i++)
            {
                for (j = 1; j < 5; j++)
                {
                    var department_id = i;
                    var pallet_type_id = j;
                    query_string += "(0," + date_string + ", " + time_string + ", " + date_string + ", " + "'someone'" + ", " + "False," + pallet_type_id + "," + department_id + "," + customer_id +  "," + counting_control_id + "),";
                }
            }
            for (i = 5; i < 9; i++)
            {
                var department_id = 5;
                var pallet_type_id = i;
                var query_string = query_string += "(0," + date_string + ", " + time_string + ", " + date_string + ", " + "'someone'" + ", " + "False," + pallet_type_id + "," + department_id + "," + customer_id + "," + counting_control_id + ")" + ((i == 8) ? ";" : ",");
            }   
	console.log(query_string);        
            return await Query(query_string);

        });    
    });
}
async function LockCustomer(customer_id, flag)
{
    var f = (flag == true) ? true : fasle;
    var query = "UPDATE Customer SET locked = " + f + " WHERE id = " + customer_id + ";";
    return await Query(query);
}
async function HasOngoingCount(customer_id, date_string)
{
    var query = "select * from Counting where customer_id = " + customer_id + " and created_date = " + date_string + ";";

    var rows = await Query(query);

    return (rows.length > 0);
}
function GetCurrentDateString()
{
    var today = new Date();    

    var y = today.getFullYear();
    var m = (today.getMonth() + 1);
    var d = today.getDate();

    var date_string = '"'+(y + '-' + ((m < 10) ? "0":"") + m + '-' + ((d < 10) ? "0":"") + d)+'"';
	
return date_string;

}
async function Query(input_query)
{    
    let conn;
    var query_failed = false;
    try
    {
        conn = await pool.getConnection();
        rows = await conn.query(input_query);
    }
    catch (err)
    {
        query_failed = true;
        console.log("Query failed");
        throw err;
    }
    finally
    {
        if (!query_failed)
        {
            conn.end();
            if (rows)
            {
                return rows;
            }
            else
            {
                return "[]";
            }
        }
    }
}
