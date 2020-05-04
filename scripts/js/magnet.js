(function() {
    var App, Background, Bars, Canvas, Stage, SubClass,
        extend = function(child, parent) {
            for (var key in parent) {
                if (hasProp.call(parent, key)) child[key] = parent[key];
            }

            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        },
        hasProp = {}.hasOwnProperty,
        bind = function(fn, me) {
            return function() {
                return fn.apply(me, arguments);
            };
        };

    SubClass = (function() {
        function SubClass(root, data) {
            this.root = root;
            if (typeof this.init === "function") {
                this.init(data);
            }
        }

        return SubClass;

    })();

    Background = (function(superClass) {
        extend(Background, superClass);

        function Background() {
            return Background.__super__.constructor.apply(this, arguments);
        }

        Background.prototype.draw = function(c) {
            c.fillStyle = "#000000";
            return c.fillRect(0, 0, this.root.width, this.root.height);
        };

        return Background;

    })(SubClass);

    Bars = (function(superClass) {
        extend(Bars, superClass);

        function Bars() {
            this.onTouchMove = bind(this.onTouchMove, this);
            this.onMouseMove = bind(this.onMouseMove, this);
            return Bars.__super__.constructor.apply(this, arguments);
        }

        Bars.prototype.pointer = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        Bars.prototype.lookAt = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };

        Bars.prototype.spacing = {
            x: 30,
            y: 30
        };

        Bars.prototype.scaling = {
            x: 5,
            y: 25
        };

        Bars.prototype.init = function() {
            window.addEventListener("mousemove", this.onMouseMove);
            return window.addEventListener("touchmove", this.onTouchMove);
        };

        Bars.prototype.onMouseMove = function(e) {
            return this.updatePointer(e.clientX, e.clientY);
        };

        Bars.prototype.onTouchMove = function(e) {
            e.preventDefault();
            return this.updatePointer(e.touches[0].clientX, e.touches[0].clientY);
        };

        Bars.prototype.updatePointer = function(x, y) {
            return this.pointer = {
                x: x,
                y: y
            };
        };

        Bars.prototype.loop = function(delta) {
            this.lookAt.x += ((this.pointer.x - this.lookAt.x) / 5) * (delta / (1000 / 60));
            this.lookAt.y += ((this.pointer.y - this.lookAt.y) / 5) * (delta / (1000 / 60));
            if (Math.abs(this.lookAt.x - this.pointer.x) < 0.5) {
                this.lookAt.x = this.pointer.x;
            }
            if (Math.abs(this.lookAt.y - this.pointer.y) < 0.5) {
                return this.lookAt.y = this.pointer.y;
            }
        };

        Bars.prototype.draw = function(c) {
            var results, x, y;
            x = 0;
            y = 0;
            c.fillStyle = "#FFFFFF";
            results = [];
            while (x < this.root.width + this.spacing.x) {
                while (y < this.root.height + this.spacing.y) {
                    this.box(c, x, y);
                    y += this.spacing.y;
                }
                y = 0;
                results.push(x += this.spacing.x);
            }
            return results;
        };

        Bars.prototype.box = function(c, x, y) {
            var a, d, divisor, h, max, min, mult, s, w;
            c.save();
            a = Math.atan2(this.lookAt.y - y, this.lookAt.x - x);
            a += 90 * (Math.PI / 180);
            d = Math.sqrt(Math.pow(this.lookAt.x - x, 2) + Math.pow(this.lookAt.y - y, 2));
            max = 1;
            mult = Math.max(this.root.width, this.root.height) / 25;
            divisor = this.spacing.x * mult;
            min = 0.1;
            s = Math.min(Math.max(max - (d / divisor), min), max);
            c.translate(x, y);
            c.rotate(a);
            w = this.scaling.x * s;
            h = this.scaling.y * s;
            c.fillRect(-w / 2, -h / 2, w, h);
            return c.restore();
        };

        return Bars;

    })(SubClass);

    Canvas = (function(superClass) {
        extend(Canvas, superClass);

        function Canvas() {
            this.onResize = bind(this.onResize, this);
            return Canvas.__super__.constructor.apply(this, arguments);
        }

        Canvas.prototype.init = function() {
            this.build();
            this.addListeners();
            return this.onResize();
        };

        Canvas.prototype.build = function() {
            var style;
            this.element = document.createElement("canvas");
            document.body.appendChild(this.element);
            style = document.createElement("style");
            style.innerHTML = "html, body, canvas { margin: 0; padding: 0; position: absolute; overflow: hidden; height: 100%; width: 100%; left: 0; top: 0; }";
            return document.head.appendChild(style);
        };

        Canvas.prototype.addListeners = function() {
            return window.addEventListener("resize", this.onResize);
        };

        Canvas.prototype.onResize = function() {
            this.root.width = window.innerWidth;
            this.root.height = window.innerHeight;
            this.element.setAttribute("width", this.root.width);
            this.element.setAttribute("height", this.root.height);
            this.element.style.width = this.root.width + "px";
            return this.element.style.height = this.root.height + "px";
        };

        return Canvas;

    })(SubClass);

    Stage = (function(superClass) {
        extend(Stage, superClass);

        function Stage() {
            return Stage.__super__.constructor.apply(this, arguments);
        }

        Stage.prototype.init = function() {
            this.canvas = this.root.canvas.element;
            return this.ctx = this.canvas.getContext("2d");
        };

        Stage.prototype.loop = function() {
            this.clear();
            return this.draw();
        };

        Stage.prototype.clear = function() {
            return this.ctx.clearRect(0, 0, this.root.width, this.root.height);
        };

        Stage.prototype.draw = function() {
            var base, i, len, results, task, tasks;
            tasks = ["background", "bars"];
            results = [];
            for (i = 0, len = tasks.length; i < len; i++) {
                task = tasks[i];
                results.push(typeof(base = this.root[task]).draw === "function" ? base.draw(this.ctx) : void 0);
            }
            return results;
        };

        return Stage;

    })(SubClass);

    App = (function() {
        App.prototype.past = new Date().getTime();

        App.prototype.loop = function() {
            var base, delta, i, len, present, results, task, tasks;
            requestAnimationFrame(this.loop);
            present = new Date().getTime();
            delta = present - this.past;
            this.past = present;
            tasks = ["stage", "bars"];
            results = [];
            for (i = 0, len = tasks.length; i < len; i++) {
                task = tasks[i];
                results.push(typeof(base = this[task]).loop === "function" ? base.loop(delta) : void 0);
            }
            return results;
        };

        function App() {
            this.loop = bind(this.loop, this);
            this.canvas = new Canvas(this);
            this.background = new Background(this);
            this.bars = new Bars(this);
            this.stage = new Stage(this);
            this.loop();
        }

        return App;

    })();

    new App();

}).call(this);