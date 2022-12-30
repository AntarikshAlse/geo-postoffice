const displayContainer = document.getElementById("postalData");
const mapContainer = document.getElementById("map");
const Coordinates = document.getElementById("data");
const ip = document.getElementById("ip");
const pinData = document.getElementById("pinData");
const searchTxt = document.getElementById("searchTxt");
let ipData = {};
let postArray = [];
async function getData(e) {
  e.currentTarget.classList.add("d-none");
  let req = await fetch("https://ipinfo.io/json?token=e2503ee53a3dc3");
  ipData = await req.json();
  // Setting text of element P with id gfg
  ip.innerHTML += ` ${ipData.ip}`;
  showPosition(ipData);
}

async function showPosition(position) {
  Coordinates.innerHTML = `
  <div class="d-flex justify-content-between">
  <span style="width:40%">Lat: ${ipData.loc.split(",")[0]}</span>
  <span style="width:40%">City: ${ipData.city}</span>
  <span style="width:40%">Organization: ${ipData.org}</span>
</div>
<div class="d-flex justify-content-between">
  <span style="width:40%">Lon: ${ipData.loc.split(",")[1]}</span>
  <span style="width:40%">Region: ${ipData.region}</span>
  <span style="width:40%">Host Name: ${ipData.org.split(" ")[1]}</span>
</div>
  `;
  mapContainer.innerHTML = `
  <iframe src="https://maps.google.com/maps?q=${ipData.loc.split(",")[0]},${
    ipData.loc.split(",")[1]
  }&output=embed" class="w-100" height="400px" frameborder="0" style="border:0"/>
`;
  const dateTime = new Date().toLocaleString("en-US", {
    timeZone: ipData.timezone,
  });
  await fetchData(ipData.postal, dateTime);
}
/* Postal Data */

const fetchData = async (pincode, dateTime) => {
  const url = `https://api.postalpincode.in/pincode/${pincode}`;
  let response = "";
  try {
    response = await fetch(url);
    const data = await response.json();
    postArray = [...data[0].PostOffice];
    pinData.innerHTML = `
    <div class="card-body pe-4">
    <h6 class="card-title py-2 ">TimeZone:  ${ipData.timezone}</h6>
    <h6 class="card-title py-2 ">Date&Time:  ${dateTime}</h6>
    <h6 class="card-title py-2 ">PinCode:  ${pincode}</h6>
    <h6 class="card-title py-2 ">Message:  ${data[0].Message}</h6>
  </div>
  `;
    let displayData = "";
    postArray.forEach((element) => {
      displayData += `
      <div class="card m-auto w-100"> 
        <div class="card-body pe-4">
          <h6 class="card-title "><span class="text-muted">Name: </span>${element.Name}</h6>
          <h6 class="card-title "><span class="text-muted">Branch Type: </span>${element.BranchType}</h6>
          <h6 class="card-title "><span class="text-muted">Delivery Status: </span>${element.DeliveryStatus}</h6>
          <h6 class="card-title "><span class="text-muted">District: </span>${element.District}</h6>
          <h6 class="card-title "><span class="text-muted">Division:</span> ${element.Division}</h6>
        </div>
      </div>
          `;
    });
    displayContainer.innerHTML = displayData;
    searchTxt.classList.add("show"); // show the search bar
  } catch (err) {
    if (!response.ok) {
      displayContainer.innerHTML = `
        <div class="container ">
        <h4 class="card-title  text-danger">No Result Found</h4>
        <span class="text-warning">${err}</span>
        </div>
        `;
      return false;
    }
  }
};

const search = (e) => {
  e.preventDefault();
  let txt = searchTxt.value;
  console.log(txt);
  let displayData = "";
  postArray.forEach((item) => {
    // Partial matching by includes();
    if (item.Name.includes(txt) || item.BranchType.includes(txt)) {
      displayData += `
      <div class="card m-auto w-100"> 
        <div class="card-body pe-4">
          <h6 class="card-title "><span class="text-muted">Name: </span>${item.Name}</h6>
          <h6 class="card-title "><span class="text-muted">Branch Type: </span>${item.BranchType}</h6>
          <h6 class="card-title "><span class="text-muted">Delivery Status: </span>${item.DeliveryStatus}</h6>
          <h6 class="card-title "><span class="text-muted">District: </span>${item.District}</h6>
          <h6 class="card-title "><span class="text-muted">Division:</span> ${item.Division}</h6>
        </div>
      </div>
          `;
    }
  });
  if (displayData) {
    displayContainer.innerHTML = displayData;
  } else {
    displayContainer.innerHTML = `
    <div class="container ">
    <h4 class="card-title  text-danger">No Result Found</h4>
    </div>
    `;
  }
};
