// credit to http://codepen.io/Sheepeuh/pen/cFazd  for the base of this codepen

//SOME SETTINGS TO PLAY WITH

var INTENSITY = 50;
var RAINRATIO = 0.5;
// snow velocity
var sx = 5;
var sy = 1;
// rain velocity
var rx = 0.25;
var ry = 4;
var bg = document.getElementById('bg');
var content = document.getElementById('content');
var sd_button = document.getElementById('sheep_dash');
var mf_button = document.getElementById('movie_filter');
var facebook = document.getElementById('facebook');
var twitter = document.getElementById('twitter');


(function(ns) {
  ns = ns || window;
  function ParticleSystem(ctx, width, height, intensity, rainRatio) {
    this.particles = [];
    this.drops = [];
    intensity  = intensity || 100;
    this.rainRatio = rainRatio || 1;
    this.addParticle = function() {
       if (Math.random() < this.rainRatio) {
        this.particles.push(new Rain(ctx, width));
      } else {
        this.particles.push(new Snow(ctx, width));
      }
    }
    while(intensity--) {
     this.addParticle();
    }
    this.render = function() {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,1)';
      //ctx.fillRect(0, 0, width, height);
      for (var i = 0, particle; particle = this.particles[i]; i++) {
        particle.render();
      }
      for (var i = 0, drop; drop = this.drops[i]; i++) {
        ctx.globalAlpha = drop.alpha;
        ctx.fillStyle = drop.color;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    this.update = function() {
       for (var i = 0, particle; particle = this.particles[i]; i++) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.y > height-1) {
          if ( particle.explode) {
            this.explosion(particle.x, particle.y, particle.color);
            this.particles.splice(i--,1);
            this.addParticle();
          } else {
            particle.vx = 0;
            particle.vy = 0;
            particle.y = height;
            if (particle.killAt && particle.killAt < +new Date) this.particles.splice(i--,1);
            else if ( ! particle.killAt) {
              particle.killAt = +new Date + 10000;
             this.addParticle();
            }
          }
        }
        
      }
      for (var i = 0, drop; drop = this.drops[i]; i++) {
        drop.x += drop.vx;
        drop.y += drop.vy;
        drop.radius -= 0.075;
        if (drop.alpha > 0) {
          drop.alpha -= 0.005;
        } else {
          drop.alpha = 0;
        }
        if (drop.radius < 0) {
          this.drops.splice(i--, 1);
        }
      }

    }
    this.explosion = function(x, y, color, amount) {
      amount = amount || 15;
      while (amount--) {
        this.drops.push( 
        {
          vx : (Math.random() * 4-2	),
          vy : (Math.random() * -1 ),
          x : x,
          y : y,
          radius : 0.65 + Math.floor(Math.random() *1.6),
          alpha : 1,
          color : color
        })
      }
    }

  }
  
  function Rain(ctx,width) {
    this.vx = (Math.random() * rx);
    this.vy = (Math.random() * ry) + 1;
    this.x = Math.floor((Math.random()*width));
    this.y = -Math.random() * 30;
    this.alpha = 1;
    this.color = "hsla(200,0%,80%, 1)";
    this.render = function() {
       ctx.globalAlpha = this.alpha;
       ctx.fillStyle = this.color;
       ctx.fillRect(this.x, this.y, this.vy / 2, this.vy * 4);
    }
    this.explode = true;
  }
  
  function Snow(ctx,width) {
    this.vx = ((Math.random() - 0.5) * sx);
    this.vy = (Math.random() * sy) + 1;
    this.x = Math.floor((Math.random()*width));
    this.y = -Math.random() * 30;
    this.alpha = 1;
    this.radius = Math.random() * 4;
    this.color = "hsla(200,0%,100%, 1)";
    this.render = function() {
       ctx.globalAlpha = this.alpha;
       ctx.fillStyle = this.color;
       ctx.beginPath();
       ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
       ctx.fill();
    }
    this.explode = false;
  }
    
  
  ns.precCanvas = function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');  
    width = canvas.width = window.innerWidth;
	  height = canvas.height = window.innerHeight;
    var particleSystem = new ParticleSystem(ctx, width, height, INTENSITY, RAINRATIO);
    render_buttons();
    (function draw() {
      ctx.drawImage(bg, 0, 0, width, height);
      requestAnimationFrame(draw);
      particleSystem.update();
      particleSystem.render();
      draw_content(ctx);
    })();

    function draw_content (ctx) {
      var h = height;
      var w = height * 1.5;
      var x = (width - w) / 2;
      var y = 0;

      ctx.drawImage(content, x, y, w, h);
    }

    function render_buttons () {
      var h = height;
      var w = height * 1.5;
      var x = (width - w) / 2;
      var y = 0;

      // sheep dash 
      sd_button.style.left = Math.round(x + 0.26 * w) + 'px';
      sd_button.style.top = Math.round(y + 0.35 * h) + 'px';
      sd_button.style.width = Math.round(0.25 * w) + 'px';
      sd_button.style.height = Math.round(0.35 * h) + 'px';

      // movie filter
      mf_button.style.left = Math.round(x + 0.53 * w) + 'px';
      mf_button.style.top = Math.round(y + 0.35 * h) + 'px';
      mf_button.style.width = Math.round(0.25 * w) + 'px';
      mf_button.style.height = Math.round(0.35 * h) + 'px';

      // facebook
      facebook.style.left = Math.round(x + 0.07 * w) + 'px';
      facebook.style.top = Math.round(y + 0.82 * h) + 'px';
      facebook.style.width = Math.round(0.27 * w) + 'px';
      facebook.style.height = Math.round(0.13 * h) + 'px';

      // twitter
      twitter.style.left = Math.round(x + 0.35 * w) + 'px';
      twitter.style.top = Math.round(y + 0.82 * h) + 'px';
      twitter.style.width = Math.round(0.285 * w) + 'px';
      twitter.style.height = Math.round(0.14 * h) + 'px';
    }

  }
  
  
})(window);

precCanvas();