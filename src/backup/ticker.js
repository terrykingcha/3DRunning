define(function() {
    var updaters = {};
    var id = 0;
    var raf = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function(fn) { 
                    return setTimeout(fn, 1000 / 60);
                };
    var caf = window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.msCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                function(id) {
                    clearTimeout(id);
                };

    var rafId;
    var last;
    function loop() {
        raf(loop);

        var now = Date.now();
        var delta = 0;
        if (last !== undefined) {
            delta = now - last; 
        }
        last = now;

        Object.keys(updaters).forEach(function(uid) {
            updaters[uid] && updaters[uid](delta);
        });
    }

    return {
        add: function(fn) {
            if (fn._uid === undefined) {
                var uid = id++;
                updaters['uid-' + uid] = fn;
                fn._uid = uid;
            }
            return fn._uid;
        },

        remove: function(id) {
            var fn;
            if (typeof id === 'number') {
                fn = updaters[id];
            } else if (typeof id === 'function') {
                fn = id;
            }

            if (fn && fn._uid !== undefined) {
                updaters[fn._uid] = undefined;
                fn._uid = undefined;
            }
        },

        run() {
            if (rafId === undefined) {
                raf(loop);
            }
        },

        stop() {
            if (rafId !== undefined) {
                caf(rafId);
                rafId = undefined;
            }
        }
    }
});