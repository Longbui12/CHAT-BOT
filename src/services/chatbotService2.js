import request from "request";
require("dotenv").config();

const IMAGE_DETAIL_ROOMS = "https://bit.ly/long-bot1";

let getImageRoomsTemplate = () => {
  let response = {
    attachment: {
      type: "image",
      payload: {
        url: IMAGE_DETAIL_ROOMS,
        is_reusable: true,
      },
    },
  };
  return response;
};

let getButtonRoomsTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "Nhà hàng có thể phục vụ tối đa 300 khách",
        buttons: [
          {
            type: "postback",
            title: "MENU CHÍNH",
            payload: "MAIN_MENU",
          },
          {
            type: "postback",
            title: "ĐẶT BÀN",
            payload: "RESERVE_TABLE",
          },
        ],
      },
    },
  };
  return response;
};
let handleShowDetailRooms = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send an image
      let response1 = getImageRoomsTemplate();
      // send a button templates : text, button
      let response2 = getButtonRoomsTemplate();
      await callSendAPI(sender_psid, response1);
      await callSendAPI(sender_psid, response2);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  handleShowDetailRooms,
};
