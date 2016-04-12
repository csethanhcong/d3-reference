/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Helpers = __webpack_require__(1);

	var Helpers = _interopRequireWildcard(_Helpers);

	var _Chart = __webpack_require__(2);

	var _Chart2 = _interopRequireDefault(_Chart);

	var _Dataset = __webpack_require__(8);

	var _Dataset2 = _interopRequireDefault(_Dataset);

	var _ContextZoomingController = __webpack_require__(7);

	var _ContextZoomingController2 = _interopRequireDefault(_ContextZoomingController);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	jQuery(document).ready(function ($) {
	    var windowHeight = $(window).innerHeight();
	    var headerHeight = $('#chart-area').find('.panel-heading').outerHeight();
	    var contentHeight = windowHeight - headerHeight - 62;
	    $('#chart').css('height', contentHeight);

	    var contentWidth = $('#chart').outerWidth();
	    var svgSize = Helpers.getInnerSize(contentWidth, contentHeight);

	    var margin = { top: 20, right: 20, bottom: 30, left: 40 };

	    var parentChart = new _Chart2.default(d3, '#chart-canvas', svgSize, margin);
	    window.parentChart = parentChart;

	    var $jsonFileInput = $('#json-file');
	    $jsonFileInput.change(function (e) {
	        var filename = e.target.value.split('\\').pop();
	        if (filename) {
	            $('#json-file + label').html(filename);
	        } else {
	            $('#json-file + label').html('Choose a JSON file');
	        }
	    });

	    window.chart = null;

	    $('#btn-update').click(function () {
	        var jsonFiles = document.getElementById('json-file').files,
	            data = null;
	        if (jsonFiles.length && !!window.chart) {
	            var fs = new FileReader();
	            fs.onload = function (evt) {
	                try {
	                    data = JSON.parse(evt.target.result);
	                    window.dataset = new _Dataset2.default(data);
	                    window.dataset.fetch(function () {
	                        var _this = this;

	                        // `this` is now the dataset
	                        window.chart.draw(this);

	                        if (window.chart.config('canContextZoomed')) {
	                            parentChart.drawZoomingController(this);
	                            parentChart.zoomingController.onUpdated(function (extent) {
	                                window.chart.draw(_this.rows(function (row) {
	                                    return row._index >= extent[0] && row._index <= extent[1];
	                                }));
	                            });
	                        }
	                    });
	                } catch (e) {
	                    console.log(e);
	                }
	            };
	            fs.readAsText(jsonFiles[0]);
	        }
	    });

	    $('#btn-create-bar').click(newChart(parentChart.charts.bar));
	    $('#btn-create-bar-histogram').click(newChart(parentChart.charts.barHistogram));
	    $('#btn-create-line').click(newChart(parentChart.charts.line()));
	    $('#btn-create-area').click(newChart(parentChart.charts.area()));

	    function newChart(newChart) {
	        return function (e) {
	            e.preventDefault();

	            var xAttr = $('#x-field').val().trim();
	            var yAttrs = $('#y-fields').val().split(',').map(function (e) {
	                return e.trim();
	            });

	            window.chart = newChart.call();

	            window.chart.config('width', parentChart.width).config('height', parentChart.height).config('xAttr', xAttr).config('yAttrs', yAttrs);

	            $('#btn-update').click();
	        };
	    }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * Get the inner rectangle with a specific ratio
	 *
	 * @param width
	 * @param height
	 * @returns {{}}
	 */
	function getInnerSize(width, height) {
	    var ratio = 2;
	    var currentRatio = width / height;
	    var size = {};
	    if (currentRatio > ratio) {
	        size.height = height;
	        size.width = height * ratio;
	    } else {
	        size.width = width;
	        size.height = width / ratio;
	    }
	    return size;
	}
	exports.getInnerSize = getInnerSize;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Bar = __webpack_require__(3);

	var _Bar2 = _interopRequireDefault(_Bar);

	var _Line = __webpack_require__(4);

	var _Line2 = _interopRequireDefault(_Line);

	var _Area = __webpack_require__(5);

	var _Area2 = _interopRequireDefault(_Area);

	var _BarHistogram = __webpack_require__(6);

	var _BarHistogram2 = _interopRequireDefault(_BarHistogram);

	var _ContextZoomingController = __webpack_require__(7);

	var _ContextZoomingController2 = _interopRequireDefault(_ContextZoomingController);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Chart = (function () {
	    function Chart(d3, area, size, margin) {
	        var _this = this;

	        _classCallCheck(this, Chart);

	        this.d3 = d3;
	        this.margin = margin;
	        this.width = size.width - margin.left - margin.right;
	        this.height = size.height - margin.top - margin.bottom;
	        this.svg = d3.select(area).append('svg').attr('width', this.width + margin.left + margin.right).attr('height', this.height + margin.top + margin.bottom).append('g').attr('transform', "translate(" + margin.left + "," + margin.top + ")").attr('class', 'main-wrap');
	        this.area = area;

	        var self = this;

	        this.charts = {
	            bar: function bar() {
	                _this.clear();
	                return new _Bar2.default(_this.svg);
	            },
	            barHistogram: function barHistogram() {
	                _this.clear();
	                return new _BarHistogram2.default(_this.svg);
	            },
	            line: function line() {
	                return new _Line2.default(self.d3, self.svg, self.width, self.height);
	            },
	            area: function area() {
	                return new _Area2.default(self.d3, self.svg, self.width, self.height);
	            }
	        };
	    }

	    _createClass(Chart, [{
	        key: 'clear',
	        value: function clear() {
	            this.svg.selectAll("*").remove();

	            return this;
	        }
	    }, {
	        key: 'drawZoomingController',
	        value: function drawZoomingController(data) {

	            d3.select(this.area).selectAll('svg.zooming-controller').remove();
	            var controllerSvg = d3.select(this.area).append('svg').attr('class', 'zooming-controller').attr('width', this.width + this.margin.left + this.margin.right).attr('height', 70).append('g').attr('transform', "translate(" + this.margin.left + "," + this.margin.top + ")");

	            this.zoomingController = new _ContextZoomingController2.default(controllerSvg);
	            this.zoomingController.config('width', this.width).draw(data);

	            return this.zoomingController;
	        }
	    }]);

	    return Chart;
	})();

	exports.default = Chart;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Bar = (function (_Koto) {
	    _inherits(Bar, _Koto);

	    function Bar(selection) {
	        _classCallCheck(this, Bar);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bar).call(this, selection));

	        var chart = _this;

	        // define configs
	        _this.configs = {
	            height: {
	                name: 'height',
	                description: 'The height of the chart.'
	            },
	            width: {
	                name: 'width',
	                description: 'The width of the chart.'
	            },
	            xAttr: {
	                name: 'x_attr',
	                description: 'The attribute that defines the x axis',
	                value: '_index'
	            },
	            yAttrs: {
	                name: 'y_attrs',
	                description: 'The attributes that defines the "y" values',
	                value: ['value'],
	                getter: function getter() {
	                    return Array.isArray(this.value) ? this.value : [this.value];
	                }
	            },
	            canContextZoomed: {
	                name: 'can_context_zoomed',
	                description: 'Can this chart enable context zooming',
	                value: true,
	                setter: function setter() {
	                    throw 'This property is read-only';
	                }
	            },
	            transitionDuration: {
	                name: 'transition_duration',
	                value: 500,
	                description: 'Transition duration in millisecond'
	            }
	        };

	        _this.accessor('x', function (e) {
	            return e[_this.config('xAttr')];
	        });
	        _this.accessor('y', function (e) {
	            return _this.config('yAttrs').map(function (a) {
	                return e[a];
	            });
	        });

	        _this.layer('bars', _this.base.append('g'), {
	            dataBind: function dataBind(data) {
	                return this.selectAll('.bar-group').data(data, function (d) {
	                    return chart.accessor('x')(d);
	                });
	            },
	            insert: function insert() {
	                return this.append('g').attr('class', 'bar-group');
	            }
	        }).on('enter', function (selection) {
	            selection.attr('transform', function (d) {
	                return "translate(" + _this.x(_this.accessor('x')(d)) + ", 0)";
	            });

	            selection.selectAll('rect').data(function (d) {
	                return _this.accessor('y')(d);
	            }).enter().append('rect').attr('class', 'bar').attr('x', function (d, i) {
	                return _this.x1(i);
	            }).attr('y', function (d) {
	                return _this.config('height');
	            }).attr('width', _this.x1.rangeBand()).attr('height', 0).style('fill', function (d, i) {
	                return _this.color(i);
	            }).transition().duration(+chart.config('transitionDuration')).attr('y', function (d) {
	                return _this.y(d);
	            }).attr('height', function (d) {
	                return _this.config('height') - _this.y(d);
	            });
	        }).on('exit', function (selection) {
	            selection.selectAll('rect').transition().duration(+chart.config('transitionDuration')).attr('y', function (d) {
	                return _this.config('height');
	            }).attr('height', 0);
	        }).on('exit:transition', function (selection) {
	            selection.duration(+chart.config('transitionDuration')).attr('width', 0).remove();
	        }).on('update', function (selection) {
	            selection.transition().duration(+chart.config('transitionDuration')).attr('transform', function (d) {
	                return "translate(" + _this.x(_this.accessor('x')(d)) + ", 0)";
	            });

	            var subset = selection.selectAll('rect').data(function (d) {
	                return _this.accessor('y')(d);
	            });

	            // update
	            subset.transition().duration(+chart.config('transitionDuration')).attr('x', function (d, i) {
	                return _this.x1(i);
	            }).attr('y', function (d) {
	                return _this.y(d);
	            }).attr('width', _this.x1.rangeBand()).attr('height', function (d) {
	                return _this.config('height') - _this.y(d);
	            }).style('fill', function (d, i) {
	                return _this.color(i);
	            });

	            subset.exit().remove();
	        });
	        return _this;
	    }

	    _createClass(Bar, [{
	        key: 'transform',
	        value: function transform(dataset) {
	            return dataset.columns([this.config('xAttr')].concat(this.config('yAttrs'))).toJSON();
	        }
	    }, {
	        key: 'preDraw',
	        value: function preDraw(data) {
	            var _this2 = this;

	            this.base.attr('class', 'barchart');

	            this.x = d3.scale.ordinal().rangeRoundBands([0, this.config('width')], '.1');

	            this.y = d3.scale.linear().range([this.config('height'), 0]);

	            this.color = d3.scale.category20c();

	            this.x.domain(data.map(function (d) {
	                return _this2.accessor('x')(d);
	            }));
	            this.y.domain([0, Math.round(d3.max(data, function (d) {
	                return d3.max(_this2.accessor('y')(d));
	            }) * 1.3)]);

	            this.x1 = d3.scale.ordinal().domain(this.config('yAttrs').map(function (d, i) {
	                return i;
	            })).rangeRoundBands([0, this.x.rangeBand()]);

	            this.xAxis = d3.svg.axis().scale(this.x).tickFormat(function (_) {
	                return "";
	            }).orient("bottom");

	            this.yAxis = d3.svg.axis().scale(this.y).orient("left").ticks(10);

	            var xAxis = this.base.select('.axis.x-axis');
	            var yAxis = this.base.select('.axis.y-axis');

	            if (xAxis.empty()) {
	                this.base.append("g").attr("class", "axis x-axis").attr("transform", "translate(0, " + this.config('height') + ")").call(this.xAxis);
	            } else {
	                xAxis.transition().call(this.xAxis);
	            }

	            if (yAxis.empty()) {
	                this.base.append("g").attr("class", "axis y-axis").call(this.yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Value");
	            } else {
	                yAxis.transition().call(this.yAxis);
	            }
	        }
	    }]);

	    return Bar;
	})(Koto);

	exports.default = Bar;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Line = (function () {
	    function Line(d3, svg, width, height) {
	        _classCallCheck(this, Line);

	        this.d3 = d3;
	        this.svg = svg;
	        this.width = width;
	        this.height = height;

	        this.x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
	        this.y = d3.scale.linear().range([height, 0]);

	        this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");

	        this.yAxis = d3.svg.axis().scale(this.y).orient("left").ticks(10);
	    }

	    _createClass(Line, [{
	        key: "draw",
	        value: function draw(data) {
	            this.svg.attr('class', 'linechart');

	            data = data.map(function (e, i) {
	                if (typeof e.value != 'undefined') {
	                    return { name: "" + i, value: e.value };
	                } else {
	                    return { name: "" + i, value: e };
	                }
	            });

	            this.x.domain(data.map(function (d) {
	                return d.name;
	            }));

	            this.y.domain([0, this.d3.max(data, function (d) {
	                return d.value;
	            })]);

	            var self = this;
	            var xAxis = this.svg.select(".axis.x-axis");
	            var yAxis = this.svg.select(".axis.y-axis");

	            this.line = this.d3.svg.line().interpolate("monotone").x(function (d) {
	                return self.x(d.name);
	            }).y(function (d) {
	                return self.y(d.value);
	            });

	            if (xAxis.empty()) {
	                this.svg.append("g").attr("class", "axis x-axis").attr("transform", "translate(0, " + self.height + ")").call(self.xAxis);
	            } else {
	                xAxis.transition().call(self.xAxis);
	            }

	            if (yAxis.empty()) {
	                this.svg.append("g").attr("class", "axis y-axis").call(self.yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Value");
	            } else {
	                yAxis.transition().call(self.yAxis);
	            }

	            var line = this.svg.selectAll('.line').data([data]).attr('class', 'line');

	            line.enter().append('path').attr('class', 'line').attr('d', self.line);

	            line.transition().attr('d', self.line);

	            line.exit().remove();
	        }
	    }]);

	    return Line;
	})();

	exports.default = Line;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Area = (function () {
	    function Area(d3, svg, width, height) {
	        _classCallCheck(this, Area);

	        this.d3 = d3;
	        this.svg = svg;
	        this.width = width;
	        this.height = height;

	        this.x = d3.scale.linear().range([0, width]);
	        this.y = d3.scale.linear().range([height, 0]);

	        this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");

	        this.yAxis = d3.svg.axis().scale(this.y).orient("left").ticks(10);
	    }

	    _createClass(Area, [{
	        key: "draw",
	        value: function draw(data) {
	            this.svg.attr('class', 'areachart');

	            data = data.map(function (e, i) {
	                if (typeof e.value != 'undefined') {
	                    return { name: i, value: e.value };
	                } else {
	                    return { name: i, value: e };
	                }
	            });

	            this.x.domain([0, data.length - 1]);

	            this.y.domain([0, this.d3.max(data, function (d) {
	                return d.value;
	            })]);

	            var self = this;
	            var xAxis = this.svg.select(".axis.x-axis");
	            var yAxis = this.svg.select(".axis.y-axis");

	            this.area = this.d3.svg.area().interpolate("monotone").x(function (d) {
	                return self.x(d.name);
	            }).y0(self.height).y1(function (d) {
	                return self.y(d.value);
	            });

	            if (xAxis.empty()) {
	                this.svg.append("g").attr("class", "axis x-axis").attr("transform", "translate(0, " + self.height + ")").call(self.xAxis);
	            } else {
	                xAxis.transition().call(self.xAxis);
	            }

	            if (yAxis.empty()) {
	                this.svg.append("g").attr("class", "axis y-axis").call(self.yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Value");
	            } else {
	                yAxis.transition().call(self.yAxis);
	            }

	            var area = this.svg.selectAll('.area').data([data]).attr('class', 'area');

	            area.enter().append('path').attr('class', 'area').attr('d', self.area);

	            area.transition().attr('d', self.area);

	            area.exit().remove();
	        }
	    }]);

	    return Area;
	})();

	exports.default = Area;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BarHistogram = (function (_Koto) {
	    _inherits(BarHistogram, _Koto);

	    function BarHistogram(selection) {
	        _classCallCheck(this, BarHistogram);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BarHistogram).call(this, selection));

	        _this.configs = {
	            height: {
	                name: 'height',
	                description: 'The height of the chart.'
	            },
	            width: {
	                name: 'width',
	                description: 'The width of the chart.'
	            },
	            xAttr: {
	                name: 'x_attr',
	                description: 'The attribute that defines the x axis',
	                value: '_index'
	            },
	            yAttrs: {
	                name: 'attr',
	                description: 'The selected attribute of the data set to present',
	                setter: function setter(values) {
	                    if (Array.isArray(values)) {
	                        return values[0];
	                    } else {
	                        return values;
	                    }
	                }
	            },
	            canContextZoomed: {
	                name: 'can_context_zoomed',
	                description: 'Can this chart enable context zooming',
	                value: false,
	                setter: function setter() {
	                    throw 'This property is read-only';
	                }
	            },
	            transitionDuration: {
	                name: 'transition_duration',
	                value: 500,
	                description: 'Transition duration in millisecond'
	            }
	        };

	        _this.accessor('val', function (e) {
	            return e[_this.config('yAttrs')];
	        });

	        _this.layer('bars', _this.base.append('g'), {
	            dataBind: function dataBind(data) {
	                return this.selectAll('.bar').data(data);
	            },
	            insert: function insert() {
	                return this.append('g').attr('class', 'bar');
	            }
	        }).on('enter', function (selection) {
	            selection.attr("transform", function (d) {
	                return "translate(" + _this.x(d.x) + "," + _this.y(d.y) + ")";
	            }).append('rect').attr('x', 1).attr('width', _this.barWidth).attr('height', function (d) {
	                return _this.config('height') - _this.y(d.y);
	            });
	        });
	        return _this;
	    }

	    _createClass(BarHistogram, [{
	        key: 'transform',
	        value: function transform(dataset) {
	            var data = dataset.column(this.config('yAttrs')).data;

	            this.xDomain = d3.extent(data);

	            return d3.layout.histogram()(data);
	        }
	    }, {
	        key: 'preDraw',
	        value: function preDraw(data) {
	            this.base.attr('class', 'bar-histogram-chart');

	            console.log(data);

	            this.barWidth = Math.round(this.config('width') / data.length - 1);

	            this.x = d3.scale.linear().range([0, this.config('width')]).domain(this.xDomain);

	            this.y = d3.scale.linear().range([this.config('height'), 0]);

	            this.y.domain([0, Math.round(d3.max(data, function (d) {
	                return d.y;
	            }) * 1.3)]);

	            this.xAxis = d3.svg.axis().scale(this.x).ticks(data.length).orient("bottom");

	            this.yAxis = d3.svg.axis().scale(this.y).orient("left").ticks(10);

	            var xAxis = this.base.select('.axis.x-axis');
	            var yAxis = this.base.select('.axis.y-axis');

	            if (xAxis.empty()) {
	                this.base.append("g").attr("class", "axis x-axis").attr("transform", "translate(0, " + this.config('height') + ")").call(this.xAxis);
	            } else {
	                xAxis.transition().call(this.xAxis);
	            }

	            if (yAxis.empty()) {
	                this.base.append("g").attr("class", "axis y-axis").call(this.yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Value");
	            } else {
	                yAxis.transition().call(this.yAxis);
	            }
	        }
	    }]);

	    return BarHistogram;
	})(Koto);

	exports.default = BarHistogram;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ContextZoomingController = (function (_Koto) {
	    _inherits(ContextZoomingController, _Koto);

	    function ContextZoomingController(selection) {
	        _classCallCheck(this, ContextZoomingController);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ContextZoomingController).call(this, selection));

	        var chart = _this;

	        _this.configs = {
	            height: {
	                name: 'height',
	                value: 30,
	                description: 'The height of the controller'
	            },
	            width: {
	                name: 'width',
	                description: 'The width of the chart'
	            },
	            backgroundColor: {
	                name: 'background_color',
	                value: '#ddd',
	                description: 'The controller background color'
	            },
	            brushColor: {
	                name: 'brush_color',
	                value: '#000',
	                description: 'The main color of the brush'
	            },
	            brushOpacity: {
	                name: 'brush_opacity',
	                value: 0.15,
	                description: 'The opacity of the brush'
	            },
	            xAttr: {
	                name: 'x_attr',
	                description: 'The attribute that defines the x axis',
	                value: '_index'
	            }
	        };

	        _this.callbacks = {
	            updated: []
	        };

	        _this.accessor('x', function (e) {
	            return e[_this.config('xAttr')];
	        });
	        return _this;
	    }

	    _createClass(ContextZoomingController, [{
	        key: 'onUpdated',
	        value: function onUpdated(f) {
	            this.callbacks.updated.push(f);
	        }
	    }, {
	        key: 'transform',
	        value: function transform(dataset) {
	            return dataset.columns([this.config('xAttr')]).toJSON();
	        }
	    }, {
	        key: 'preDraw',
	        value: function preDraw(data) {
	            var _this2 = this;

	            this.base.attr('class', 'context-zoom-controller');

	            this.x = d3.scale.linear().range([0, this.config('width')]).domain(d3.extent(data, function (d) {
	                return _this2.accessor('x')(d);
	            }));

	            this.base.append("rect").attr("class", "grid-background").attr("width", +this.config('width')).attr("height", +this.config('height')).style('fill', this.config('backgroundColor'));

	            this.base.append("g").attr("class", "x grid").style('fill', 'none').attr("transform", "translate(0," + this.config('height') + ")").call(d3.svg.axis().scale(this.x).orient("bottom").ticks(data.length).tickSize(-this.config('height')).tickFormat("")).selectAll('.tick').attr('stroke', '#fff').attr('opacity', 0.5);

	            var brush = d3.svg.brush().x(this.x).extent(this.x.domain());

	            brush.on("brush", function () {
	                var extent0 = brush.extent(),
	                    extent1;

	                // if dragging, preserve the width of the extent
	                if (d3.event.mode === "move") {
	                    var d0 = Math.round(extent0[0]),
	                        d1 = Math.round(extent0[1]);
	                    extent1 = [d0, d1];
	                }

	                // otherwise, if resizing, round both dates
	                else {
	                        extent1 = extent0.map(Math.round);
	                    }

	                d3.select(this).call(brush.extent(extent1));
	            });

	            brush.on('brushend', function () {
	                _this2.callbacks.updated.forEach(function (f) {
	                    f.call(_this2, brush.extent());
	                });
	            });

	            var brushGraphic = this.base.append("g").attr("class", "brush").call(brush);

	            var arc = d3.svg.arc().outerRadius(+this.config('height') / 4).startAngle(0).endAngle(function (d, i) {
	                return i ? -Math.PI : Math.PI;
	            });

	            brushGraphic.selectAll("rect").attr("height", +this.config('height'));

	            brushGraphic.selectAll(".extent").attr('fill', this.config('brushColor')).attr('opacity', this.config('brushOpacity'));

	            brushGraphic.selectAll(".resize").append("path").attr("transform", "translate(0," + +this.config('height') / 2 + ")").style('fill', '#666').style('stroke', '#000').attr("d", arc);
	        }
	    }]);

	    return ContextZoomingController;
	})(Koto);

	exports.default = ContextZoomingController;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DataSet = (function () {
	    function DataSet(data) {
	        _classCallCheck(this, DataSet);

	        this.dataset = new Miso.Dataset({
	            data: data,
	            extract: function extract(data) {
	                return data.map(function (e, i) {
	                    if ((typeof e === 'undefined' ? 'undefined' : _typeof(e)) === 'object') {
	                        e._index = i;
	                        return e;
	                    } else {
	                        return {
	                            _index: i,
	                            value: e
	                        };
	                    }
	                });
	            }
	        });
	    }

	    /**
	     * Fetch the dataset
	     * @param callback success
	     * @param callback error
	     * @returns {*}
	     */

	    _createClass(DataSet, [{
	        key: 'fetch',
	        value: function fetch(_success, _error) {
	            return this.dataset.fetch({
	                success: function success() {
	                    if (!!_success) {
	                        _success.call(this);
	                    }
	                },
	                error: function error(e) {
	                    console.log(e);
	                    if (!!_error) {
	                        _error.call(this, e);
	                    }
	                }
	            });
	        }
	    }]);

	    return DataSet;
	})();

	exports.default = DataSet;

/***/ }
/******/ ]);