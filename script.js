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

let denominations = [ // in cents
  ['PENNY', 1],
  ['NICKEL', 5],
  ['DIME', 10],
  ['QUARTER', 25],
  ['ONE', 100],
  ['FIVE', 500],
  ['TEN', 1000],
  ['TWENTY', 2000],
  ['ONE HUNDRED', 10000]
]

const priceEl = document.getElementById('price');
const cashInDrawer = document.getElementById('cashInDrawer');
const drawer = document.querySelector('.drawer');
const purchase = document.getElementById('purchase-btn');
const form = document.querySelector('form');
const kaching = new Audio("kaching.mp3");

//display the price on loading the page
priceEl.textContent = `$${price}`;

//TODO: figure out how to take the cid and display it at loading time
cid.forEach( (type, amt) => {
  console.log(type, amt);
  
});

//TODO: react to the purchase button
purchase.addEventListener("animationend", () => purchase.classList.remove('button'));
purchase.addEventListener('animationEnd', () => drawer.classList.remove('close'));
form.addEventListener('animationEnd', () => form.classList.remove('close'));
purchase.addEventListener('click', (e) => {
  e.preventDefault();
  purchase.classList.add('button');
  kaching.play();
  setTimeout(() => {
    drawer.classList.add('close');
    form.classList.add('close');
  
  }, 500);
});
//TODO: update the displayed CID from whatever's left at the end of a purchase
