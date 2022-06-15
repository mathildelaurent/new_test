console.log('connectée');

document.getElementById('orderId').innerHTML = localStorage.getItem('order');
localStorage.clear('order');