requirejs([
    'flow/preload',
    'flow/build',
    'flow/render',
    'animate/running',
    'animate/control',
    'ticker',
    'debug'
], function(
    preload,
    build,
    render,
    running,
    control,
    ticker,
    debug
) {
    preload(function(manager) {
        build(manager);
        // debug();
        // window.THREE_DEBUG = true;

        ticker.add(render);
        ticker.add(control);
        ticker.run();

        document.querySelector('#start').addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('#ui').style.display = 'none';
            ticker.add(running);
        });
    });
});