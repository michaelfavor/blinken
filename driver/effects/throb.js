var util = require('util');
var Easing = require('easing');
var Effect = require('../effect');

var STEPS = 25;

// This effect uses an easing library to produce a throb effect, alternating
// between two given colors.
//
// options = {}, optional, valid keys:
//   'period' = number of milliseconds between steps
//   'start_color':  [r,g,b], the color to start with, defaults to [0,0,0]
//   'end_color':  [r,g,b], the color to end up with after period*STEPS milliseconds, defaults to [255,255,255]
//   'easing': string for type of easing to perform, defaults to 'linear'
function Throb(grid, options)
{
  options = options || {};
  Throb.super_.call(this, 'throb', grid, options);
  this.current_step = 0;
  this.start_color = options['start_color'] || [0,0,0];
  this.end_color = options['end_color'] || [255,255,255];
  this.easing = Easing(STEPS, options['easing'] || 'linear', {
    endToEnd: true
  });
}

// Set up inheritance from Effect
util.inherits(Throb, Effect);

Throb.prototype.calculate_single = function(start_value, end_value) {
  return start_value + (end_value-start_value) * this.easing[this.current_step];
};

Throb.prototype.calculate_rgb = function() {
  var r = this.calculate_single(this.start_color[0], this.end_color[0]);
  var g = this.calculate_single(this.start_color[1], this.end_color[1]);
  var b = this.calculate_single(this.start_color[2], this.end_color[2]);
  return [r,g,b];
};

Throb.prototype.step = function() {
  // Set entire grid to the new color
  var color = this.calculate_rgb();
  this.grid.setGridColor(color);

  // Update step number
  this.current_step++;
  this.current_step = this.current_step % STEPS;

  // Keep going forever
  return true;
};

// Export constructor directly
module.exports = Throb;
