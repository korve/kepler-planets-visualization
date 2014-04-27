/**
 * Created by andre (http://mindpress.de/ on 26.04.2014
 */

var fs = require('fs'),
	http = require('http'),
	cheerio = require('cheerio');

http.get('http://kepler.nasa.gov/Mission/discoveries/', function(res){

	var body = '';
	res.on('data', function(chunk) {
		body += chunk;
	});

	res.on('end', function() {
		$ = cheerio.load(body);

		var rows = $('table#example tr').slice(5);
		var planets = [];

		rows.each(function(i){
			var cells = $(this).find('td');
			
			var planet = {
				name: $(cells[0]).find('a').html(),
				link: 'http://kepler.nasa.gov' + $(cells[0]).find('a').attr('href'),
				KOI: $(cells[1]).find('a').attr('href') || null,
				massJupiter: parseFloat($(cells[2]).html()) || null,
				massEarth: parseFloat($(cells[3]).html()) || null,
				radiusJupiter: parseFloat($(cells[4]).html()) || null,
				radiusEarth: parseFloat($(cells[5]).html()) || null,
				density: parseFloat($(cells[6]).html()) || null,
				temp: parseFloat($(cells[7]).html()) || null,
				transit: parseFloat($(cells[8]).html()) || null,
				period: parseFloat($(cells[9]).html()) || null,
				sma: parseFloat($(cells[10]).html()) || null,
				ecc: parseFloat($(cells[11]).html()) || null,
				inc: parseFloat($(cells[12]).html()) || null, 
				dist: parseFloat($(cells[13]).html()) || null
			};

			planets.push(planet);
		});


		var csv = fs.open('planets.csv', 'w+', function(err, fd){
			var sep = ';';
			var offset = 0;

			//add header
			(function(){
				var cols = [];

				for(var key in planets[0])
				{
					if(planets[0].hasOwnProperty(key) === false)
						continue;					

					cols.push(key);
				}

				var data = new Buffer(cols.join(sep) + '\n', 'utf-8'),
					len = data.length;

				fs.write(fd, data, 0, len, offset, function(err){
					if(err)
						console.error('Could not write chunk ' + err);
				});

				offset += len;
			})();

			planets.forEach(function(el, i){

				var cols = [];

				for(var key in el)
				{
					if(el.hasOwnProperty(key) === false)
						continue;					

					cols.push(el[key]);
				}

				var data = new Buffer(cols.join(sep) + '\n', 'utf-8'),
					len = data.length;

				fs.write(fd, data, 0, len, offset, function(err){
					if(err)
						console.error('Could not write chunk ' + err);
				});

				offset += len;

			});

			fs.close(fd);

		});
	});

})
.on('error', function(e) {
	console.error("Got error: " + e.message);
});