
var queries_maraidb = require('./queries_mariadb');
var common = require('./common.js');
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const port = 8081;


//test
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/UpdateTimeRapportArrival', async (req, res) => {
    
    var id = req.param("counting_control_id").toString().replace(/[^0-9]/g, '');
    var date_arrival = req.param("date_arrival");
    var time_arrival = req.param("time_arrival");
   
    if(id.length > 0)
    {                 
        var rows = await queries_maraidb.UpdateTimeRapportArrival(id, "'" + date_arrival+"'","'" + time_arrival+"'");
        res.send(rows);            
    }
    else
    {
        res.send("[]");
    }
});
app.post('/UpdateTimeRapportLoadingStart', async (req, res) => {
    
    var id = req.param("counting_control_id").toString().replace(/[^0-9]/g, '');
    var date_loading_start = req.param("date_loading_start");
    var time_loading_start = req.param("time_loading_start");
   
    if(id.length > 0)
    {                 
        var rows = await queries_maraidb.UpdateTimeRapportLoadingStart(id, "'" + date_loading_start+"'","'" + time_loading_start+"'");
        res.send(rows);            
    }
    else
    {
        res.send("[]");
    }
});
app.post('/UpdateTimeRapportLoadingEnd', async (req, res) => {
    
    var id = req.param("counting_control_id").toString().replace(/[^0-9]/g, '');
    var date_loading_end = req.param("date_loading_end");
    var time_loading_end = req.param("time_loading_end");
   
    if(id.length > 0)
    {                 
        var rows = await queries_maraidb.UpdateTimeRapportLoadingEnd(id, "'" + date_loading_end+"'","'" + time_loading_end+"'");
        res.send(rows);            
    }
    else
    {
        res.send("[]");
    }
});
app.post('/UpdateTimeRapportDeparture', async (req, res) => {
    
    var id = req.param("counting_control_id").toString().replace(/[^0-9]/g, '');
    var date_departure = req.param("date_departure");
    var time_departure = req.param("time_departure");
   
    if(id.length > 0)
    {                 
        var rows = await queries_maraidb.UpdateTimeRapportDeparture(id, "'" + date_departure+"'","'" + time_departure+"'");
        res.send(rows);            
    }
    else
    {
        res.send("[]");
    }
});
app.post('/UpdateCountingControlById', async (req, res) => {
    
    var id = req.param("counting_control_id").toString().replace(/[^0-9]/g, '');

    if(id.length > 0)
    {
        var done = [req.body.done_dry,req.body.done_cold,req.body.done_frozen,req.body.done_global];
        var status_id = req.body.status_id.toString().replace(/[^0-9]/g, '');
        if(status_id.length > 0)
        {           
            var rows = await queries_maraidb.UpdateCountingControlById(id, req.body.status_id,done[3],done[0],done[1],done[2]);
            res.send(rows);            
        }
        else
        {
            res.send("[]");
        }
    }
    else
    {
        res.send("[]");
    }
});
app.post('/UpdateCountingValue', async (req, res) => {
        
    var counting_control_id = req.param("counting_control_id").toString().replace(/[^0-9]/g, '');
    var department = req.param("department").toString().replace(/[^0-9]/g, '');
    var pallet_type = req.param("pallet_type").toString().replace(/[^0-9]/g, '');
    var value = req.param("value");

    var valid_input = false;

    if(counting_control_id.length > 0)
    {
        if(department.length > 0)
        {
            if(pallet_type.length > 0)
            {
                
                    valid_input = true;
                
            }
        
        }
    
    }
    if(valid_input)
    {
        if(value < 0)
        {
            value = 0;
        }
        var rows = await queries_maraidb.UpdateCountingValue(counting_control_id,department,pallet_type,value);
        res.send(rows);
    }
    else
    {
        res.send("[]");
    }
    

    
});

app.get('/GetFullStatusById/:id', async (req, res) => {

    var counting_control_id = req.param("id");
    var rows = await queries_maraidb.GetFullStatusById(counting_control_id);
    res.send(rows);
});
app.post('/UpdateDepartmentStatusById', async (req, res) => {

    var counting_control_id = req.body.counting_control_id;
    var department_id = req.body.department_id;
    var done = req.body.done;

    var rows = await queries_maraidb.UpdateDepartmentStatusById(counting_control_id,department_id,done);
    
    res.send(rows);   
    
});
app.post('/UpdateStatusById', async (req, res) => {

    var counting_control_id = req.body.counting_control_id;
    var status_id = req.body.status_id;

    var rows = await queries_maraidb.UpdateStatusById(counting_control_id,status_id);
    
    res.send(rows);   
    
});
app.post('/UpdateCountings', async (req, res) => {

    var ids = req.body.ids;
    var counts = req.body.counts;

    var valid_input = false;

    if(Array.isArray(ids))
    {
        if(Array.isArray(counts))
        {
            if(counts.length === ids.length)
            {
                var n = 0;
                for(var i = 0;i < counts.length;i++)
                {
                    if(Number.isInteger(ids[i]))
                    {
                        n++;
                    }
                    else
                    {
                        break;
                    }
                }
                if(n === counts.length)
                {
                    valid_input = true;
                }
            }
        }
    }
    if(valid_input)
    {
        var rows = await queries_maraidb.UpdateCountings(ids, counts);
        res.send(rows);
    }
    else
    {
        res.send("[]");
    }   
    
});

app.get('/GetCustomers', async (req, res) => {

    var rows = await queries_maraidb.GetCustomers();
    res.send(rows);
});
app.get('/CustomerExists/:id', async (req, res) => {
   
    var id = req.param("id");
    var rows = await queries_maraidb.CustomerExists(id);
    res.send(rows);
});
app.get('/CustomerExists/:number', async (req, res) => {
   
    var id = req.param("number");
    var rows = await queries_maraidb.CustomerNumberExists(number);
    res.send(rows);
});
app.get('/CustomerNumberExists/:number', async (req, res) => {
   
    var id = req.param("number");
    var rows = await queries_maraidb.CustomerNumberExists(id);
    res.send(rows);
});
app.post('/CreateCustomer', async (req, res) => {

    
    customer_name = req.body.name;
    customer_number = req.body.number;
    max_height = req.body.max_height;
    tumba = req.body.tumba;
    var rows = await queries_maraidb.CreateCustomer(customer_name,customer_number,max_height,tumba);
    res.send(rows);
});
app.get('/GetCustomerById/:id', async (req, res) => {

    var id = req.param("id");
    id = id.toString().replace(/[^0-9]/g, '');

    if(id.length > 0)
    {
        var rows = await queries_maraidb.GetCustomerById(id);
        res.send(rows);
    }
    else
    {
        res.send("[]");
    }
    
});
app.get('/GetCountingControlById/:id', async (req, res) => {

    var id = req.param("id");
    id = id.toString().replace(/[^0-9]/g, '');

    if(id.length > 0)
    {
        var rows = await queries_maraidb.GetCountingControlById(id);
        res.send(rows);
    }
    else
    {
        res.send("[]");
    }

});
app.get('/GetStatuses', async (req, res) => {

    var rows = await queries_maraidb.GetStatuses();
    res.send(rows);
});
function ValidateDate(date)
{
    if (date.length == 8)
    {
        if (/\d{8}/.test(date))
        {
            var d = date.split('');
            return ("'" + d[0] + d[1] + d[2] + d[3] + "-" + d[4] + d[5] + "-" + d[6] + d[7] + "'");
        }
    }

    return "1900-01-01";

}
app.get('/GetCompleteCountingByDate/:date_start/:date_end', async (req, res) => {

    var date_start = ValidateDate(req.param("date_start"));
    var date_end = ValidateDate(req.param("date_end"));   
   
    var rows = await queries_maraidb.GetCompleteCountingByDate(date_start,date_end);


    res.send(rows);
});

app.get('/GetCompleteCountingByDate2/:date_start/:date_end', async (req, res) => {

    var date_start = ValidateDate(req.param("date_start"));
    var date_end = ValidateDate(req.param("date_end"));   
   
    var rows = await queries_maraidb.GetCompleteCountingByDate2(date_start,date_end);


    res.send(rows);
});

app.get('/GetCompleteTumbaCountingByDate/:date_start/:date_end/:tumba', async (req, res) => {

    var date_start = ValidateDate(req.param("date_start"));
    var date_end = ValidateDate(req.param("date_end"));   
    var tumba = req.param("tumba");   

    if(typeof tumba === 'string')
    {
	if(tumba.length === 3)
        {
            var rows = await queries_maraidb.GetCompleteTumbaCountingByDate(date_start,date_end,tumba);

            res.send(rows);
        }
        else
        {
            res.send("[]");
        }
    }
    else
    {
        res.send("[]");
    }    
});


app.get('/GetCountingControlByDate/:date', async (req, res) => {

    var date = req.param("date");
    
    if (date.length == 8)
    {
        if (/\d{8}/.test(date))
        {
            var d = date.split('');

            var date_string = "'" + d[0] + d[1] + d[2] + d[3] + "-" + d[4] + d[5] + "-" + d[6] + d[7] + "'";

            var rows = await queries_maraidb.GetCountingControlByDate(date_string);

            res.send(rows);
        }
        else
        {
            res.send("[]");
        }
    }
    else
    {
        res.send("[]");
    }

});
app.get('/GetCountingControlByDateAndStatus/:date/:status', async (req, res) => {

    var date = req.param("date");
    var status = req.param("status");

    if (date.length == 8)
    {
        if (/\d{8}/.test(date))
        {
            var d = date.split('');

            var date_string = "'" + d[0] + d[1] + d[2] + d[3] + "-" + d[4] + d[5] + "-" + d[6] + d[7] + "'";

            var rows = await queries_maraidb.GetCountingControlByDateAndStatus(date_string,status);

            res.send(rows);
        }
        else
        {
            res.send("[]");
        }
    }
    else
    {
        res.send("[]");
    }

});
app.get('/GetDepartments', async (req, res) => {

    var rows = await queries_maraidb.GetDepartments();
    res.send(rows);
});
app.get('/GetPalletTypes', async (req, res) => {

    var rows = await queries_maraidb.GetPalletTypes();
    res.send(rows);
});

app.get('/StartCounting/:id', async (req, res) => {

    var id = req.param("id");
    id = id.toString().replace(/[^0-9]/g, '');

    if(id.length > 0)
    {
        var rows = await queries_maraidb.StartCounting(id);
        res.send(rows);
    }
    else
    {
        res.send("[]");
    }
});
app.get('/GetCustomerIdFromNumber/:number', async (req, res) => {

    var number = req.param("number");
    var rows = await queries_maraidb.GetCustomerIdFromNumber(number);
    res.send(rows);
});
app.get('/StartCountingAtDate/:number/:date/:time', async (req, res) => {

    var number = req.param("number");
    var date = req.param("date");
    var time = req.param("time");
    number = number.toString().replace(/[^0-9]/g, '');

    date = common.ParseDate(date);
    time = common.ParseTime(time);

    var today = common.GetCurrentDateString();

    var today = new Date();
    var y = today.getFullYear();

    if(date.split('-')[0].replace("'","") + ">=" + y)
    {
        if(number.length > 0)
        {
            var rows = await queries_maraidb.GetCustomerIdFromNumber(number);
            
            if(rows.length > 0)
            {
                var id = rows[0].id;
                rows = await queries_maraidb.StartCountingAtDate(id,date,time);
                res.send(rows);
            }
            else
            {
                res.send("[]");
            }
            
        }
        else
        {
            res.send("[]");
        }
    }
    else
    {
        res.send("[]");
    }



    
});



app.post('/StartCountingAtDate2/', async (req, res) => {
    
    var number = req.body.number;
    var date = req.body.date;
    var time = req.body.time;

    var date_expected_arrival = req.body.date_expected_arrival;
    var time_expected_arrival = req.body.time_expected_arrival;

    var date_expected_loading = req.body.date_expected_loading;
    var time_expected_loading = req.body.time_expected_loading;

    var date_expected_departure = req.body.date_expected_departure;
    var time_expected_departure = req.body.time_expected_departure;

    number = number.toString().replace(/[^0-9]/g, '');

    date = common.ParseDate(date);
    time = common.ParseTime(time);

    date_expected_arrival = common.ParseDate(date_expected_arrival);
    time_expected_arrival = common.ParseTime(time_expected_arrival);

    date_expected_loading = common.ParseDate(date_expected_loading);
    time_expected_loading = common.ParseTime(time_expected_loading);

    date_expected_departure = common.ParseDate(date_expected_departure);
    time_expected_departure = common.ParseTime(time_expected_departure);

    var today = common.GetCurrentDateString();

    var today = new Date();
    var y = today.getFullYear();

    if(date.split('-')[0].replace("'","") + ">=" + y)
    {
        if(number.length > 0)
        {
            var rows = await queries_maraidb.GetCustomerIdFromNumber(number);
            
            if(rows.length > 0)
            {
                var id = rows[0].id;
                rows = await queries_maraidb.StartCountingAtDate2(id,date,time,date_expected_arrival,time_expected_arrival,date_expected_loading,time_expected_loading,date_expected_departure,time_expected_departure);
                res.send(rows);
            }
            else
            {
                res.send("[]");
            }
            
        }
        else
        {
            res.send("[]");
        }
    }
    else
    {
        res.send("[]");
    }



    
});






app.get('/GetCountingByCustomerIdAndDate/:id/:date', async (req, res) => {
    
    var date = req.param("date");
    
    var id = req.param("id");
    id = id.toString().replace(/[^0-9]/g, '');

    if(id.length > 0)
    {
        if (date.length == 8)
        {
            if (/\d{8}/.test(date))
            {
                var d = date.split('');

                var date_string = "'" + d[0] + d[1] + d[2] + d[3] + "-" + d[4] + d[5] + "-" + d[6] + d[7] + "'";

                var rows = await queries_maraidb.GetCountingByCustomerIdAndDate(id, date_string);

                res.send(rows);
            }
            else
            {
                res.send("[]");
            }
        }
        else
        {
            res.send("[]");
        }
    }
    else
    {
        res.send("[]");
    }

    

});
app.get('/GetCustomersByDate/:date', async (req, res) => {

    var date = req.param("date");

    if (date.length == 8)
    {
        if (/\d{8}/.test(date))
        {
            var d = date.split('');

            var date_string = "'" + d[0] + d[1] + d[2] + d[3] + "-" + d[4] + d[5] + "-" + d[6] + d[7] + "'";

            var rows = await queries_maraidb.GetCustomersByDate(date_string);

            res.send(rows);
        }
        else
        {

            res.send("[]"); 
        }
    }
    else
    {

        res.send("[]"); 
    }

    
});


var cert = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}
var server = http.createServer(app);


server.listen(8081, () => {
    console.log("server starting on port : " + port)
});



