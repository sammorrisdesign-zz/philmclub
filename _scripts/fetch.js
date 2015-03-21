// Imported Modules
var spreadsheet = require('google-spreadsheet');
var fs = require('fs');

// Get Login Details
var auth = JSON.parse(fs.readFileSync('../google.json', 'utf8'));

// Get Spreadsheet Data
var sheet = new spreadsheet('1HKhrlsLLeEYmI40Tv9U8Y0JvsHSXaFlmh9Ioe4DKC6Y');
var data = [];

sheet.setAuth(auth.email, auth.password, function(err) {
    sheet.getRows(1, function(err, rows){
        for(i = 4; i < rows.length; i++) {
            // console.log(rows[i]);
            var row = {
                "filmName"  : rows[i]['title'],
                "ratings"   : {
                    "mario" : rows[i]['mário'].length,
                    "frank" : rows[i]['frank'].length,
                    "sophie": rows[i]['sophie'].length,
                    "sam"   : rows[i]['sam'].length,
                    "chris" : rows[i]['chris'].length
                }
            }
            data.push(row);
        }
    });
});

var port = process.env.PORT || 5000;