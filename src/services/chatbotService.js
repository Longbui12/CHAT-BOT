import request from "request";
require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = "https://bit.ly/long-bot1";
const IMAGE_MAIN_MENU_2 = "https://bit.ly/long-bot2";
const IMAGE_MAIN_MENU_3 = "https://bit.ly/long-bot3";
const IMAGE_MAIN_MENU_4 =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=60&w=500&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D";
// ============================= //
const IMAGE_VIEW_FAST_FOOD =
  "https://t4.ftcdn.net/jpg/02/10/97/65/240_F_210976505_c4vXGI6NCIaV8qlANGNP1gDPIt2rjYjC.jpg";
const IMAGE_VIEW_PHO =
  "https://i-giadinh.vnecdn.net/2021/03/07/nhngang1-1615086549-6552-1615087048.jpg";
const IMAGE_VIEW_BUN =
  "https://vivu.net/uploads/2022/05/Nuoc-dung-hao-hang-dem-lai-huong-vi-tuyet-voi-cho-mon-dac-san-Hue-noi-tieng-.jpeg";
const IMAGE_VIEW_BREAD =
  "https://product.hstatic.net/1000365253/product/the_coffee_club_vietnam_bo_ne_1_a0d03151eaa54fc48fc0e21237055c25_1024x1024.jpg";
// ============================= //

const IMAGE_VIEW_APPETIZERS = "https://bit.ly/3Se3ukf";
const IMAGE_VIEW_FISH = "https://bit.ly/40pOVwd";
const IMAGE_VIEW_MEAT = "https://bit.ly/40b0jvF";

const IMAGE_BACK_MAIN_MENU = "https://bit.ly/4957slc";

let callSendAPI = (sender_psid, response) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v18.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};
let getUserName = (sender_psid) => {
  return new Promise((resolve, reject) => {
    // Send the HTTP request to the Messenger Platform
    request(
      {
        uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
        method: "GET",
      },
      (err, res, body) => {
        if (!err) {
          body = JSON.parse(body);
          let username = `${body.last_name} ${body.first_name}`;
          resolve(username);
        } else {
          console.error("Unable to send message:" + err);
          reject(err);
        }
      }
    );
  });
};

let handleGetStarted = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let username = await getUserName(sender_psid);
      let response1 = {
        text: `Xin chào mừng bạn ${username} đến với nhà hàng của chúng tôi .`,
      };
      let response2 = getStartedTemplate();

      // send text message
      await callSendAPI(sender_psid, response1);

      // send generic template message
      await callSendAPI(sender_psid, response2);
      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let getStartedTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Nhà hàng Only-One kính chào quý khách",
            subtitle: "Dưới đây là các lựa chọn của nhà hàng",
            image_url: IMAGE_GET_STARTED,
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
              {
                type: "postback",
                title: "HƯỚNG DẪN SỬ DỤNG BOT",
                payload: "GUIDE_TO_USE",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleSendMainMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getMainMenuTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let getMainMenuTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Menu của nhà hàng",
            subtitle:
              "Chúng tôi hân hạnh mang đến cho bạn thực đơn phong phú cho các bữa ăn trong ngày .",
            image_url: IMAGE_MAIN_MENU_2,
            buttons: [
              {
                type: "postback",
                title: "BỮA SÁNG",
                payload: "BREAK_FAST_MENU",
              },
              {
                type: "postback",
                title: "BỮA TRƯA",
                payload: "LUNCH_MENU",
              },
              {
                type: "postback",
                title: "BỮA TỐI",
                payload: "DINNER_MENU",
              },
            ],
          },

          {
            title: "Giờ mở cửa :",
            subtitle: "T2-T6 5:AM - 10:PM | T7 & CN 6:AM - 9:PM",
            image_url: IMAGE_MAIN_MENU_3,
            buttons: [
              {
                type: "postback",
                title: "ĐẶT BÀN",
                payload: "RESERVE_TABLE",
              },
            ],
          },

          {
            title: "Không gian nhà hàng",
            subtitle:
              "Nhà hàng có sức chứa lên đến 300 khách ngồi và các bữa tiệc lớn .",
            image_url: IMAGE_MAIN_MENU_4,
            buttons: [
              {
                type: "postback",
                title: "CHI TIẾT CỦA PHÒNG",
                payload: "SHOW_ROOMS",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleSendBreakFastMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getBreakFastMenuTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let getBreakFastMenuTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Món ăn sáng nhanh",
            subtitle: "Nhà hàng cũng có bán những món fast-food vào buổi sáng.",
            image_url: IMAGE_VIEW_FAST_FOOD,
            buttons: [
              {
                // Appetizers
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_BREAK_FAST",
              },
            ],
          },

          {
            title: "Món Phở",
            subtitle: "Phở bò, phở gà, phở khô .",
            image_url: IMAGE_VIEW_PHO,
            buttons: [
              {
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_PHO",
              },
            ],
          },

          {
            title: "Món Bún",
            subtitle: "Bún bò huế, Bún măng gà, Bún mắm, Bún chả v..v.",
            image_url: IMAGE_VIEW_BUN,
            buttons: [
              {
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_BUN",
              },
            ],
          },
          {
            title: "Bánh mỳ chảo",
            subtitle: "Bò né, Ốp la, v..v.",
            image_url: IMAGE_VIEW_BREAD,
            buttons: [
              {
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_BREAD",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
// ====================================== //
let handleSendLunchMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getLunchMenuTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let getLunchMenuTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Món khai vị",
            subtitle: "Nhà hàng có nhiều món khai vị hấp dẫn .",
            image_url: IMAGE_VIEW_APPETIZERS,
            buttons: [
              {
                // Appetizers
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_APPETIZERS",
              },
            ],
          },

          {
            title: "Các loại cá",
            subtitle: "Cá nước mặn, nước ngọt , nước lợ .",
            image_url: IMAGE_VIEW_FISH,
            buttons: [
              {
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_FISH",
              },
            ],
          },

          {
            title: "Beef Steak",
            subtitle: "Thịt bò được nhập khẩu từ Mỹ , Úc và Nhật .",
            image_url: IMAGE_VIEW_MEAT,
            buttons: [
              {
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_MEAT",
              },
            ],
          },

          {
            title: "Quay trở lại",
            subtitle: "Quay trở lại Menu chính.",
            image_url: IMAGE_BACK_MAIN_MENU,
            buttons: [
              {
                type: "postback",
                title: "QUAY TRỞ LẠI",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
//===========================================//
let handleSendDinnerMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getDinnerMenuTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let getDinnerMenuTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Menu của nhà hàng",
            subtitle:
              "Chúng tôi hân hạnh mang đến cho bạn thực đơn phong phú cho các bữa ăn trong ngày .",
            image_url: IMAGE_MAIN_MENU_2,
            buttons: [
              {
                type: "postback",
                title: "BỮA SÁNG",
                payload: "BREAK_FAST_MENU",
              },
              {
                type: "postback",
                title: "BỮA TRƯA",
                payload: "LUNCH_MENU",
              },
              {
                type: "postback",
                title: "BỮA TỐI",
                payload: "DINNER_MENU",
              },
            ],
          },

          {
            title: "Giờ mở cửa :",
            subtitle: "T2-T6 5:AM - 10:PM | T7 & CN 6:AM - 9:PM",
            image_url: IMAGE_MAIN_MENU_3,
            buttons: [
              {
                type: "postback",
                title: "ĐẶT BÀN",
                payload: "RESERVE_TABLE",
              },
            ],
          },

          {
            title: "Không gian nhà hàng",
            subtitle:
              "Nhà hàng có sức chứa lên đến 300 khách ngồi và các bữa tiệc lớn .",
            image_url: IMAGE_MAIN_MENU_4,
            buttons: [
              {
                type: "postback",
                title: "CHI TIẾT CỦA PHÒNG",
                payload: "SHOW_ROOMS",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
//===========================================//

let handleBackToMainMenu = async (sender_psid) => {
  await handleSendMainMenu(sender_psid);
};
module.exports = {
  handleGetStarted,
  handleSendMainMenu,
  handleSendBreakFastMenu,
  handleSendLunchMenu,
  handleSendDinnerMenu,
  handleBackToMainMenu,
};
