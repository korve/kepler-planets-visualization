/**
 * Created by andre (http://mindpress.de/ on 27.04.2014
 */

$(function(){

	var planetContainer = $('.planets'),
		data = [],
		earthData = {
			massEarth: 1,
			massJupiter: 0.00314,
			radiusEarth: 1,
			radiusJupiter: 0.089,
			density: 5.515,
			temp: 255,
			period: 365.25,
			sma: 1,
			ecc: 0.016,
			inc: null
		};

	$.get('data/planets.json', '', function (json) {
		data = json;

		sort(data, 'radiusEarth');
		renderPlanets(data, 'radiusEarth');

	}, 'json');

	$('#btn-sort-by').on('click', '[data-sort-key]', function (e) {
		e.preventDefault();

		var sortKey = $(this).attr('data-sort-key') + 'Earth';

		sort(data, sortKey);
		renderPlanets(data, sortKey);
	});

	var renderPlanets = function (data, sizeKey, sortDir) {
		sortDir = (sortDir || 'asc').toLowerCase();

		planetContainer.empty();

		var canvas = Raphael(planetContainer.get(0));

		var max = null;

		if(sortDir === 'asc')
		{
			max = data[0][sizeKey];
		}
		else
		{
			var i = data.length - 1;
			while(max === null)
			{
				if(data[i][sizeKey] !== null)
				{
					max = data[i][sizeKey];
				}

				i--;
			}
		}

		var baseRadius = canvas.width /  2 *  (earthData[sizeKey] / max),
			x = canvas.width / 2,
			y = canvas.height / 2;

		data.forEach(function (planet) {
			if(typeof planet[sizeKey] === 'undefined' || planet[sizeKey] === null)
				return;

			var rad = (baseRadius * planet[sizeKey]).toFixed(6);
			canvas.circle(x, y, rad)
				.attr({
					'stroke': 'rgba(145, 244, 184, .8)',
					'stroke-width': 0,
					'fill': 'rgba(145, 244, 184, 0.025)'
				})
				.data('planet', planet)
				.hover(function hIn() {
						this.attr('stroke-width', 5);
					},
					function hOut() {
						this.attr('stroke-width', 0);
					})
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