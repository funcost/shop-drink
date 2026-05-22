// =========================
// FILE: script.js
// =========================

const form =
document.getElementById("orderForm");

const statusText =
document.getElementById("status");

const submitBtn =
document.getElementById("submitBtn");

const API_URL =
"https://script.google.com/macros/s/AKfycbyC1vAW7zJhGffyj4ns-wkCTNa70-cvGJwfxIqj1jrs0TrJwlH59FXKAzDp2bTbUuyf/exec";

const locationBtn =
document.getElementById("locationBtn");

const locationInput =
document.getElementById("location");

const drinkSelect =
document.getElementById("drink");

const sizeSelect =
document.getElementById("size");

const quantityInput =
document.getElementById("quantity");

const distanceText =
document.getElementById("distanceText");

const drinkPriceText =
document.getElementById("drinkPrice");

const shipPriceText =
document.getElementById("shipPrice");

const totalPriceText =
document.getElementById("totalPrice");

const SHOP_LAT = 18.5849801;

const SHOP_LNG = 105.6226719;

let currentDistance = 0;

let estimatedMinutes = 0;

let ship = 0;

let drinkTotal = 0;

let total = 0;

// =========================
// TÍNH KHOẢNG CÁCH
// =========================

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
){

  const R = 6371;

  const dLat =
  (lat2-lat1) * Math.PI/180;

  const dLon =
  (lon2-lon1) * Math.PI/180;

  const a =

    Math.sin(dLat/2) *
    Math.sin(dLat/2)

    +

    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180)

    *

    Math.sin(dLon/2) *
    Math.sin(dLon/2);

  const c =
  2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1-a)
  );

  return R*c;

}

// =========================
// UPDATE GIÁ
// =========================

function updatePrice(){

  const drink =
  drinkSelect.value;

  const size =
  sizeSelect.value;

  const quantity =
  Number(quantityInput.value);

  let drinkPrice = 0;

  // chưa chọn đủ
  if(!drink || !size){

    drinkPriceText.innerHTML =
    "Tiền nước: 0đ";

    shipPriceText.innerHTML =
    "Ship: 0đ";

    totalPriceText.innerHTML =
    "Tổng: 0đ";

    return;

  }

  // =========================
  // NGOÀI PHẠM VI
  // =========================

  if(currentDistance > 15){

    distanceText.innerHTML =
    "❌ Quá phạm vi giao hàng";

    drinkPriceText.innerHTML =
    "";

    shipPriceText.innerHTML =
    "";

    totalPriceText.innerHTML =
    "";

    submitBtn.disabled = true;

    return;

  }

  // =========================
  // GIÁ NƯỚC
  // =========================

  if(drink === "Trà tắc"){

    if(size === "M"){
      drinkPrice = 10000;
    }

    else if(size === "L"){
      drinkPrice = 15000;
    }

  }

  else if(
    drink === "Chanh giã tay"
  ){

    if(size === "M"){
      drinkPrice = 14000;
    }

    else if(size === "L"){
      drinkPrice = 19000;
    }

  }

  submitBtn.disabled = false;

  // =========================
  // TÍNH TIỀN
  // =========================

  drinkTotal =
  drinkPrice * quantity;

  ship =
  Math.round(currentDistance * 3000);

  total =
  drinkTotal + ship;

  // vận tốc 30km/h
  estimatedMinutes =
  Math.ceil(
    ((currentDistance / 30) * 60) + 5
  );

  // =========================
  // HIỂN THỊ
  // =========================

  distanceText.innerHTML =
  `Khoảng cách: ${currentDistance.toFixed(1)} km`;

  drinkPriceText.innerHTML =
  `Tiền nước: ${drinkTotal.toLocaleString()}đ`;

  shipPriceText.innerHTML =
  `Ship: ${ship.toLocaleString()}đ`;

  totalPriceText.innerHTML =
  `Tổng: ${total.toLocaleString()}đ`;

}

// =========================
// LẤY GPS
// =========================

locationBtn.addEventListener(
  "click",
  () => {

    if(navigator.geolocation){

      navigator.geolocation.getCurrentPosition(

        (position) => {

          const lat =
          position.coords.latitude;

          const lng =
          position.coords.longitude;

          const mapLink =
          `https://maps.google.com/?q=${lat},${lng}`;

          locationInput.value =
          mapLink;

          statusText.innerHTML =
          "✅ Đã lấy vị trí thành công";

          currentDistance =
          calculateDistance(
            

            SHOP_LAT,
            SHOP_LNG,
            lat,
            lng

          );
          console.log(lat, lng);
          console.log(currentDistance);

          updatePrice();

        },

        () => {

          currentDistance = 0;

          alert(
            "Không lấy được vị trí, vui lòng thử lại!"
          );

        }

      );

    }

    else{

      alert(
        "Thiết bị không hỗ trợ GPS!"
      );

    }

  }
);

// =========================
// SUBMIT FORM
// =========================

form.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    // chưa lấy vị trí
    if(!locationInput.value){

      alert(
        "Vui lòng lấy vị trí giao hàng!"
      );

      return;

    }

    submitBtn.classList.add(
      "loading"
    );

    submitBtn.disabled = true;

    submitBtn.innerText =
    "Đang gửi đơn...";

    const formData =
    new FormData(form);

    const data = {

    customer:
    formData.get("customer"),

    drink:
    formData.get("drink"),

    size:
    formData.get("size"),

    quantity:
    formData.get("quantity"),

    phone:
    formData.get("phone"),

    location:
    formData.get("location"),

    note:
    formData.get("note"),

    distance:
    currentDistance.toFixed(1),

    ship:
    ship,

    drinkTotal:
    drinkTotal,

    total:
    total,

    estimatedMinutes:
    estimatedMinutes

  };

    try {

      const response =
      await fetch(API_URL,{

        method:"POST",

        body:JSON.stringify(data)

      });

      const result =
      await response.text();

      console.log(result);

      if(
        result.includes("success")
      ){

        statusText.innerHTML =
        "✅ Đặt hàng thành công!";

        setTimeout(() => {

          window.location.href =
          `success.html?time=${estimatedMinutes}`;

        }, 1000);

      }

      else{

        statusText.innerHTML =
        "❌ " + result;

      }

    }

    catch(error){

      console.error(error);

      statusText.innerHTML =
      "❌ Có lỗi xảy ra";

    }

    submitBtn.classList.remove(
      "loading"
    );

    submitBtn.disabled = false;

    submitBtn.innerText =
    "Đặt hàng";

  }
);

// =========================
// EVENT
// =========================

drinkSelect.addEventListener(
  "change",
  updatePrice
);

sizeSelect.addEventListener(
  "change",
  updatePrice
);

quantityInput.addEventListener(
  "input",
  updatePrice
);

// =========================
// LOAD
// =========================

updatePrice();