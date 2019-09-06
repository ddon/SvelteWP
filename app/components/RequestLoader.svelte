<style>
.loader-bar {
    display: flex;
    flex-direction: row;

    width: 120px;
    height: 40px;

    margin: 0;
    padding: 10px;

    cursor: progress;
}

.loader-bar .loader-bar-rectangle {
    margin: 2px;
    padding: 0;
    background-color: #999999;
    height: 100%;
    width: 6px;
    display: inline-block;

    animation: loader-bar-keyframes 1.2s infinite ease-in-out;
}

.loader-bar .loader-bar-rectangle:nth-child(2) { animation-delay: -1.1s; }
.loader-bar .loader-bar-rectangle:nth-child(3) { animation-delay: -1.0s; }
.loader-bar .loader-bar-rectangle:nth-child(4) { animation-delay: -0.9s; }
.loader-bar .loader-bar-rectangle:nth-child(5) { animation-delay: -0.8s; }
.loader-bar .loader-bar-rectangle:nth-child(6) { animation-delay: -0.7s; }
.loader-bar .loader-bar-rectangle:nth-child(7) { animation-delay: -0.6s; }
.loader-bar .loader-bar-rectangle:nth-child(8) { animation-delay: -0.5s; }
.loader-bar .loader-bar-rectangle:nth-child(9) { animation-delay: -0.4s; }


@keyframes loader-bar-keyframes {
    0%, 40%, 100% {
        transform: scaleY(0.4);
    }

    20% {
        transform: scaleY(1.0);
    }
}
</style>


<div class='loader-bar'>
    <div class='loader-bar-rectangle' />
    <div class='loader-bar-rectangle' />
    <div class='loader-bar-rectangle' />
    <div class='loader-bar-rectangle' />
    <div class='loader-bar-rectangle' />
    <div class='loader-bar-rectangle' />
    <div class='loader-bar-rectangle' />
    <div class='loader-bar-rectangle' />
    <div class='loader-bar-rectangle' />
</div>

