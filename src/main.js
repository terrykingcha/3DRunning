requirejs([
    'flow/preload',
    'flow/build',
    'flow/render',
    'animate/running',
    'ticker',
    'debug'
], function(
    preload,
    build,
    render,
    running,
    ticker,
    debug
) {
    preload(function(manager) {
        build(manager);
        debug();
        // window.THREE_DEBUG = true;

        ticker.add(render);
        ticker.add(running);
        ticker.run();
    });
});