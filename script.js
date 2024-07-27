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

//display the price on loading the page
const priceEl = document.getElementById('price');
priceEl.textContent = `$${price}`;

//TODO: figure out how to take the cid and display it at loading time
const cashInDrawer = document.getElementById('cashInDrawer');
cid.forEach( (type, amt) => {
  console.log(type, amt);
  
});
//TODO: update the displayed CID from whatever's left at the end of a purchase
