/**
 * Created by andre (http://mindpress.de/ on 27.04.2014
 */

$(function(){


	var planetContainer = $('.planets'),
		metaTitle = $('.planet-title'),
		metaContainer = $('.planet-data');

	var data = [],
		currentSortKey = 'radiusEarth';

	var relPlanets = {
		earth: {
			name: 'Earth',
			mass: new BigNumber('5.972e24'),
			radius: 6371,
			massEarth: 1,
			massJupiter: 0.00314,
			radiusEarth: 1,
			radiusJupiter: 0.089,
			density: 5.515,
			temp: 255,
			period: 365.25,
			sma: 1,
			ecc: 0.016,
			inc: 0
		}
		/*jupiter: {
			name: 'Jupiter',
			mass: new BigNumber('1.899e27'),
			radius: 71492,
			massEarth: 317.82,
			massJupiter: 1,
			radiusEarth: 11.21,
			radiusJupiter: 1,
			density: 1.326,
			temp: 165,
			period: 398.88 ,
			sma: 5.203,
			ecc: 0.0484,
			inc: 1.305
		}*/
	};

	var relPlanet = relPlanets.earth;

	for(var planet in relPlanets)
	{
		if(relPlanets.hasOwnProperty(planet) === false)
			continue;

		$('.dropdown-menu-planet')
			.append('<li><a href="#" data-sort-key="' + planet + '">' + relPlanets[planet].name + '</a></li>');
	}

	$.get('data/planets.json', '', function (json) {
		data = json;

		renderPlanets(data, null, relPlanet);
	}, 'json');

	$('#btn-planet').on('click', '[data-sort-key]', function (e) {
		e.preventDefault();

		var planet = $(this).attr('data-sort-key');
		relPlanet = relPlanets[planet];

		$('.compare-with-label').html(relPlanet.name);

		renderPlanets(data, null, relPlanet);
	});

	$('#btn-sort-by').on('click', '[data-sort-key]', function (e) {
		e.preventDefault();

		var sortKey = $(this).attr('data-sort-key');
		$('.compare-by-label').html($(this).html());

		renderPlanets(data, sortKey, relPlanet);
	});

	var renderPlanets = function (data, by, compareWith, sortDir) {
		sortDir = (sortDir || 'asc').toLowerCase();

		by = by || currentSortKey;
		currentSortKey = by;

		sort(data, by, sortDir);

		planetContainer.empty();

		var canvas = Raphael(planetContainer.get(0));

		var max = null;

		if(sortDir === 'asc')
		{
			max = data[0][by];
		}
		else
		{
			var i = data.length - 1;
			while(max === null)
			{
				if(data[i][by] !== null)
				{
					max = data[i][by];
				}

				i--;
			}
		}

		var baseRadius = ($(window).width() / 2 - 100) * (compareWith[by] / max),
			x = canvas.width / 2,
			y = canvas.height / 2;

		var onHover = function() {
			this.attr({
				'stroke': 'rgba(255, 0, 0, .8)',
				'stroke-width': 4,
				'fill': 'rgba(255, 255, 255, .05)'
			});

			var planet = this.data('planet');

			var data = '';
			data += 'Mass:\t\t' + relPlanets.earth.mass.times(planet.massEarth) + '\tkg\r\n';
			data += 'Mass:\t\t' + relPlanets.earth.mass.times(planet.massEarth) + '\tkg\r\n';
			data += 'Radius:\t\t' + Math.round(relPlanets.earth.radius * planet.radiusEarth) + '\t\tkm\r\n';
			data += 'Density:\t' + (planet.density ? planet.density.toFixed(2) : 'N/A') + '\t\tg/cm³\r\n';
			data += 'Avg. Temp.:\t' + (planet.temp ? (planet.temp - 273.15).toFixed(2) : 'N/A') + '\t\tC°\r\n';
			data += 'Period:\t\t' + (planet.period ? planet.period.toFixed(2) : 'N/A') + '\t\tdays\r\n';
			data += 'SMA:\t\t' + (planet.sma || 'N/A') + '\t\tAU\r\n';
			data += 'Eccentricity:\t' + (planet.ecc || 'N/A') + '\r\n';
			data += 'Inclination:\t' + (planet.inc || 'N/A') + '°\r\n';

			metaTitle.html('<a href="' + planet.link + '">' + planet.name + '</a>');
			metaContainer.html(data);
		};

		data.forEach(function (planet) {
			if(typeof planet[by] === 'undefined' || planet[by] === null)
				return;

			var rad = (baseRadius * planet[by]).toFixed(6);

			var el = canvas.circle(x, y, rad)
				.attr({
					'stroke': 'rgba(145, 244, 184, .8)',
					'stroke-width': 1,
					'fill': 'rgba(255, 255, 255, 0)'
				})
				.data('planet', planet);

			el.hover(
				onHover,
				function hOut() {
					this.attr({
						'stroke-width': 1,
						'stroke': 'rgba(145, 244, 184, .8)',
						'fill': 'rgba(255, 255, 255, 0)'
					});
				}
			);
		});

		canvas.circle(x, y, baseRadius + 4)
			.attr({
				'stroke': '#0071ff',
				'stroke-width': 4,
				'stroke-location': 'outside'
			})
			.toFront();
	};

	var sort = function (arr, key, dir) {
		dir = (dir || 'asc').toLowerCase();

		arr.sort(function (a, b) {
			return dir === 'asc' ? (a[key] > b[key] ? -1 : 1) : (a[key] < b[key] ? -1 : 1);
		});
	};

});