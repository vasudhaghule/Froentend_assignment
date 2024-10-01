const coinToggle = document.getElementById('coin-toggle');
const intervalToggle = document.getElementById('interval-toggle');
const chartCanvas = document.getElementById('chart');
const chartContext = chartCanvas.getContext('2d');

let currentCoin = 'ETH/USDT';
let currentInterval = '1m';
let chartData = {};

// Initialize chart
const chart = new Chart(chartContext, {
    type: 'candlestick',
    data: {
        datasets: [{
            label: currentCoin,
            data: []
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

// Connect to Binance WebSocket
const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${currentCoin}@kline_${currentInterval}`);

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const candlestickData = {
        t: data.t,
        o: data.o,
        h: data.h,
        l: data.l,
        c: data.c
    };
    
    chartData[currentCoin] = chartData[currentCoin] || [];
    chartData[currentCoin].push(candlestickData);

    
    chart.data.datasets[0].data = chartData[currentCoin];
    chart.update();
};

coinToggle.addEventListener('change', (event) => {
    currentCoin = event.target.value;
    socket.close();
    socket = new WebSocket(`wss://stream.binance.com:9443/ws/${currentCoin}@kline_${currentInterval}`);
});

intervalToggle.addEventListener('change', (event) => {
    currentInterval = event.target.value;
    socket.close();
    socket = new WebSocket(`wss://stream.binance.com:9443/ws/${currentCoin}@kline_${currentInterval}`);
});