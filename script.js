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
"https://script.google.com/macros/s/AKfycbzPg1hpOaTzNXHQ2RLqqHQFejzod5cFgtJIg_en9UAj-TuRRYcc_snswLYPlpRhAqd3/exec";

const locationBtn =
document.getElementById("locationBtn");

const locationInput =
document.getElementById("location");

const drinkSelect =
document.getElementById("drink");

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

function updatePrice(){

  let drinkPrice = 0;

  const drink =
  drinkSelect.value;

  const quantity =
  Number(quantityInput.value);

  const size =
  document.getElementById("size").value;

  // ===================
  // GIÁ NƯỚC
  // ===================

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

  // ===================
  // QUÁ XA
  // ===================

  if(currentDistance > 15){

    distanceText.innerHTML =
    `❌ Quá phạm vi giao hàng`;

    drinkPriceText.innerHTML =
    "";

    shipPriceText.innerHTML =
    "";

    totalPriceText.innerHTML =
    "";

    return;

  }

  // ===================
  // TÍNH TIỀN
  // ===================

  const drinkTotal =
  drinkPrice * quantity;

  // ship làm tròn đẹp
  let ship =
  Math.ceil(currentDistance) * 3000;

  // tối thiểu 10k
  if(ship < 10000){

    ship = 10000;

  }

  const total =
  drinkTotal + ship;

  // ===================
  // HIỂN THỊ
  // ===================

  distanceText.innerHTML =
  `Khoảng cách: ${currentDistance.toFixed(1)} km`;

  drinkPriceText.innerHTML =
  `Tiền nước: ${drinkTotal.toLocaleString()}đ`;

  shipPriceText.innerHTML =
  `Ship: ${ship.toLocaleString()}đ`;

  totalPriceText.innerHTML =
  `Tổng: ${total.toLocaleString()}đ`;

}

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
          currentDistance =
          calculateDistance(

            SHOP_LAT,
            SHOP_LNG,
            lat,
            lng

          );

          updatePrice();

        },

        () => {

          alert(
            "Không lấy được vị trí, vui lòng thử lại!"
          );

        }

      );

    }


    else{

    alert(
      "Thiết bị không hỗ trợ GPS, vui lòng liên hệ lại với Phục Vụ để được tư vấn!"
    );

  }

  });   
form.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    submitBtn.classList.add("loading");

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
      formData.get("note")

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

      if(result.includes("success")){

        window.location.href =
        "success.html";

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

    submitBtn.innerText =
    "Đặt hàng";
  }
);
drinkSelect.addEventListener(
  "change",
  updatePrice
);

quantityInput.addEventListener(
  "input",
  updatePrice
);

updatePrice();
