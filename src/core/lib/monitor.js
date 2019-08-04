
export function startMonitor(callback) {
    if (window.Worker) {
        const blob = new Blob([
            document.querySelector('#web-worker-monitor').textContent
        ], {
            type: 'text/javascript'
        });

        const worker = new Worker(window.URL.createObjectURL(blob));
        worker.postMessage('start');

        worker.addEventListener('message', (evt) => {
            callback();
        });
    } else {
        const minutes = 1;
        const ms = 1000 * 60 * minutes;

        window.setInterval(() => {
            callback();
        }, ms);
    }
}

