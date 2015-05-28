// Imported modules (In order of use)
var fs = require('fs');
var readlineSync = require('readline-sync');
var spreadsheet = require('google-spreadsheet');
var movieArt = require('movie-art');
var handlebars = require('handlebars');

// Prepare the template
var html = fs.readFileSync('../_templates/index.html', 'utf8');
var template = handlebars.compile(html);

// Get login details
var detailsLocation = '../google.json';
if (fs.existsSync(detailsLocation)) {
    var auth = JSON.parse(fs.readFileSync('../google.json', 'utf8'));
} else {
    var auth = {
        "email" : readlineSync.question('Google Username (email) :'),
        "password" : readlineSync.question('Password :', {noEchoBack: true})
    };
};

// Get spreadsheet data
var sheet = new spreadsheet('1HKhrlsLLeEYmI40Tv9U8Y0JvsHSXaFlmh9Ioe4DKC6Y');
var data = [];

sheet.setAuth(auth.email, auth.password, function(err) {
    sheet.getRows(1, function(err, rows){
        for(i = 1; i < rows.length; i++) {
            var titleInfo = rows[i]['title'].split(" (");
            var row = {
                'filmName'  : titleInfo[0],
                'year'      : titleInfo[1].replace(')', ''),
                'ratings'   : {
                    'mario' : rows[i]['mário'].length,
                    'frank' : rows[i]['frank'].length,
                    'ben'   : rows[i]['ben'].length,
                    'sam'   : rows[i]['sam'].length,
                    'chris' : rows[i]['chris'].length
                },
                'watchable' : 0
            }

            for (rating in row.ratings) {
                if (row.ratings[rating] > 0 ) {
                    row.watchable++;
                }
            }
            data.push(row);
        }

        var watchableMedian = 0,
            numberOfFilms = data.length - 1;

        for(i = 0; i < numberOfFilms; i++) {
            watchableMedian += data[i].watchable;
        }
        watchableMedian = Math.floor(watchableMedian / numberOfFilms);

        function getFilm(watchableMedian) {
            var randomRow = Math.floor((Math.random() * numberOfFilms) + 1);
            if (data[randomRow].watchable > watchableMedian) {
                getFilm(watchableMedian);
            } else {
                movieArt(data[randomRow].filmName, data[randomRow].year, 'w342', function(err, url) {
                    data[randomRow].poster = url;
                    template = template(data[randomRow]);
                    fs.writeFile('../index.html', template);
                });
            }
        }

        getFilm(watchableMedian);
    });
});

var port = process.env.PORT || 5000;