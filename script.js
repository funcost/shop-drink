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
"https://script.google.com/macros/s/AKfycbwvu_hAOSSAxY8-zPVSQtni-0yPG9R2joRuXqNyD53x4T9vswyOSfwSpvYmKPr_Gaqr/exec";

const locationBtn =
document.getElementById("locationBtn");

const locationInput =
document.getElementById("location");

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

        },

        () => {

          alert(
            "Không lấy được vị trí 😭"
          );

        }

      );

    }

    else{

      alert(
        "Thiết bị không hỗ trợ GPS"
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

});