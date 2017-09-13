define(function() {
    var events = {
        start: [],
        progress: [],
        complete: [],
        error: []
    };

    var manager = new THREE.LoadingManager();

    manager.onStart = function(url, itemsLoaded, itemsTotal) {
        console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        events.start.forEach(function(fn) {
            fn();
        });
    };

    manager.onLoad = function() {
        console.log( 'Loading complete!');
        events.complete.forEach(function(fn) {
            fn();
        });
    };

    manager.onProgress = function(url, itemsLoaded, itemsTotal) {
        console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        events.progress.forEach(function(fn) {
            fn();
        });
    };

    manager.onError = function(url) {
        console.error( 'There was an error loading ' + url );
        events.error.forEach(function(fn) {
            fn();
        });
    };

    var loadedContent = {};

    return {
        add: function(id, Loader) {
            var loader = new Loader(manager);

            loadedContent[id] = {
                loader: loader
            };

            return loader;
        },

        load: function(id) {
            if (loadedContent[id]) {
                var loader = loadedContent[id].loader;
                var args = [].slice.call(arguments, 1);
                var params = [];
                var events = [];

                for (var i = 0; i < args.length; i++) {
                    var arg = args[i];
                    if (typeof arg === 'function') {
                        events.push(arg);
                    } else {
                        params.push(arg);
                    }
                }

                var onLoad = events[0];
                events[0] = function() {
                    var result = [].slice.call(arguments);
                    loadedContent[id].result = result;
                    onLoad && onLoad.apply(this, result);
                };
                loader.load.apply(loader, params.concat(events));
            }
        },

        getResult(id) {
            return loadedContent[id].result;
        },

        setResult(id, result) {
            loadedContent[id].result = result;
        },
        
        getLoader(id) {
            return loadedContent[id].loader;
        },

        on: function(name, fn) {
            if (events[name] && events[name].indexOf(fn) < 0) {
                events[name].push(fn);
            }
        },

        off: function(name, fn) {
            if (events[name]) {
                var index = events[name].indexOf(fn);
                if (index >= 0) {
                    events[name].splice(index, 1);
                }
            }
        }
    }
});