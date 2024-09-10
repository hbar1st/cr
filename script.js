let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

let denominations = { // in cents
  'PENNY': 1,
  'NICKEL': 5,
  'DIME': 10,
  'QUARTER': 25,
  'ONE': 100,
  'FIVE': 500,
  'TEN': 1000,
  'TWENTY': 2000,
  'ONE HUNDRED': 10000
}

let isDrawerOpen = true; //status of drawer visually speaking

const priceEl = document.getElementById('price');
const cashInDrawer = document.getElementById('cashInDrawer');
const drawer = document.querySelector('.drawer');
const purchase = document.getElementById('purchase-btn');
const form = document.querySelector('form');
const cashPaid = document.querySelector('#cash');
const changeFieldset = document.querySelector('details');
const kaching = new Audio("kaching.mp3");
const drawerSound = new Audio("drawer-sound.mp3");
const summary = document.querySelector('summary');
const details = document.querySelector('details');
const changeDue = document.getElementById('change-due');
const totalChangeDue = document.querySelector('summary');
const sticker = document.querySelector('.sticker');

sticker.addEventListener('dblclick', () => {
  price = (Math.floor(Math.random() * 1000 + 1) / 100).toFixed(2);
  updatePrice();
})

//display the price on loading the page
const updatePrice = (p = price) => priceEl.textContent = ` $${p}`;
updatePrice(price);

//display the cash in the drawer
function updateCashDrawer(cid) {
  for (let i = 1; i <= cid.length; i++) {
    let v = Number(cid[i-1][1]);
    document.getElementById(i).innerText = 
    Math.ceil(v*100) / denominations[cid[i-1][0]];
  }
}
updateCashDrawer(cid);

/**
* figure out how much total cash is there in the drawer
*/
function getTotalCashAmount(cid) {
  let cash = cid.reduce((acc, el)=> acc+Number(el[1]), 0);
  return cash.toFixed(0);
}

// react to typing in the input
cashPaid.addEventListener('input', (e) => {
  purchase.disabled = isNaN(Number(cash.value.trim()));
});

/**
* react to the purchase button click 
* by updating the change-due and/or opening/closing the drawer
* also updates the drawer denomination counts on display
*/
purchase.addEventListener('click', (e) => {
  let closeDrawer = false;
  let wasCashGiven = false;
  let totalChangeDueAmt = 0;
  //const statusStrings = ['INSUFFICIENT_FUNDS', 'OPEN', 'CLOSED'];
  const statusStrings = { insuffFunds : 'INSUFFICIENT_FUNDS', open : 'OPEN', closed : 'CLOSED'};
  let statusIndex = statusStrings.open;
  e.preventDefault();
  
  updatePrice(price); //make sure the current price is up
  
  const centPrice = Number((price * 100).toFixed(0));
  
  const cashPaid = cash.value.trim();
  if (( cashPaid > 5000 ) || (cashPaid < 0)) {
    alert("Cash paid should be a number between 0 and $5000");
  }
  const validCash = /(\d{0,5}.?\d\d)/;
  const cashMatch = validCash.exec(cashPaid);
  let dollarsPaid = NaN;
  if (cashPaid) {
    dollarsPaid = Number(cashMatch[0]);
    cash.value = dollarsPaid;
  }

  if (isNaN(dollarsPaid)) {
    purchase.disabled = true;
    return;
  }
  const centsPaid = Number((dollarsPaid * 100).toFixed(0));
  if ( centsPaid < centPrice ) {
    closeDrawer = true;
    statusIndex = statusStrings.closed;
    alert("Customer does not have enough money to purchase the item");
  } else {
    wasCashGiven = true;
    closeDrawer = false;
    totalChangeDueAmt = ((centsPaid - centPrice) / 100).toFixed(2);
  }
  
  if ( wasCashGiven ) {
    kaching.play();
  } else {
    drawerSound.play();
  }
  
  let cashCentValues = cid.map( el => {
    let arr = [el[0]];
    arr.push(Number((el[1] * 100).toFixed(0)));
    return arr;
  });
  
  const dollarChange = cash - price;
  let centsChange = centsPaid - centPrice;
  const totalCashCents = getTotalCashAmount(cid.map((el)=> [ el[0], Number((el[1]*100).toFixed(0))]));
  
  if (totalCashCents < centsChange) {
    //insufficient funds
    statusIndex = statusStrings.insuffFunds; 
    closeDrawer = true;
    changeDue.innerHTML = `<p>Status: ${statusIndex}</p>`;
  } else {
    if ( totalCashCents == centsChange ) {
      closeDrawer = true;
      statusIndex = statusStrings.closed;
    } else {
      statusIndex = statusStrings.open;
    }
    let cashReturned = {};
    for (let i = cashCentValues.length-1; i >= 0; i--) {
      if ( cashCentValues[i][1] != 0) {
        let dtype = cashCentValues[i][0];
        
        if (centsChange >= denominations[dtype] ) {
          
          cashReturned[dtype] ? cashReturned[dtype] = denominations[dtype] + Number(cashReturned[dtype]):
          cashReturned[dtype] = denominations[dtype];
          
          centsChange -= denominations[dtype];
          cashCentValues[i][1] -= Number(denominations[dtype]);
          if (cashCentValues[i][1] != 0) {
            i++;
          }
        }
      } 
    }
    
    if ( centsChange != 0 ) {
      statusIndex = statusStrings.insuffFunds; //inusfficient funds since there is still change due at this point
    } 
    changeDue.innerHTML = `<p>Status: ${statusIndex}</p>`;
    if ( statusIndex != statusStrings.insuffFunds) {
      Object.keys(cashReturned).map(key => {
        const dollars = (Number(cashReturned[key]) / 100).toFixed(2);
        changeDue.innerHTML += `<p> ${key}: $${dollars}</p>`;
      });
      details.open = true;
    }
    if (centsPaid === centPrice) {
      closeDrawer = true;
      statusIndex = statusStrings.closed;
      changeDue.innerHTML = "No change due - customer paid with exact cash";
    }
  }
  
  totalChangeDue.innerHTML = `Change Due: $${totalChangeDueAmt}`;
  summary.style.listStylePosition = 'inside';
  
  animateDrawer(closeDrawer);
  kaching.addEventListener('ended', event => {
    soundIndicator();
    cid = cashCentValues.map(el => [el[0], Number(el[1]/100).toFixed(2)]); //switch cents to dollars before display
    updateCashDrawer(cid);
  });
});

/**
* 
*/
function soundIndicator() {
  var context = new AudioContext();
  var o = context.createOscillator();
  var  g = context.createGain()
  o.connect(g)
  g.connect(context.destination)
  o.start(0)
  g.gain.exponentialRampToValueAtTime(
    0.00001, context.currentTime + 1
  )
}
/**
* animateDrawer will either open or close the cash register drawer
* by starting either the open or close animation sequence
* 
* @param {boolean} closeDrawer 
* side-effect: updates the isDrawerOpen boolean value
*/
function animateDrawer(closeDrawer) {
  if (!closeDrawer) {
    if (!isDrawerOpen) {
      drawer.classList.remove('close');
      changeFieldset.classList.remove('close');
      form.classList.remove('close');
      
      drawer.classList.add('open');
      changeFieldset.classList.add('open');
      form.classList.add('open');
      
      isDrawerOpen = true;
    }
  } else {
    drawer.classList.add('close');
    form.classList.add('close');
    changeFieldset.classList.add('close');
    isDrawerOpen = false;
  }
}