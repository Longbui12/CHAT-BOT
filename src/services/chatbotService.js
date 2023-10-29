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

const IMAGE_DETAIL_APPETIZER_1 = "https://bit.ly/3Qs0Iqd";
const IMAGE_DETAIL_APPETIZER_2 = "https://bit.ly/3Mfwu7k";
const IMAGE_DETAIL_APPETIZER_3 =
  "https://beptruong.edu.vn/wp-content/uploads/2016/08/goi-bo-bop-thau.jpg";

const IMAGE_DETAIL_FISH_1 =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9VnxNfci-tifZ-JRbDIQ-ATn4JVA4NJ1iApbVc7_vgiYVt6zWIExPlBPazlBEFngO-gY&usqp=CAU";
const IMAGE_DETAIL_FISH_2 =
  "https://www.sashimihome.com/wp-content/uploads/Sashimi-C%C3%A1-Ng%E1%BB%AB-Nh%E1%BA%ADt-B%E1%BA%A3n-%E2%80%93-M%C3%B3n-%C4%82n-%C4%90%E1%BA%B3ng-C%E1%BA%A5p-Nh%E1%BA%ADt-B%E1%BA%A3n.jpg";
const IMAGE_DETAIL_FISH_3 =
  "https://cakholangvudai.com/wp-content/uploads/2015/07/ca-mu-sot-me1.jpg";

const IMAGE_DETAIL_MEAT_1 =
  "https://thitbo.vivusea.com/upload/cache/article/bo-wagyu-uc_(3)_(1)_thumb.jpg";
const IMAGE_DETAIL_MEAT_2 =
  "https://www.uob.com.vn/iwov-resources/images/promotion-detail/cuisine-world-corner-308/corner-308-472x332.jpg";
const IMAGE_DETAIL_MEAT_3 =
  "https://pos.nvncdn.net/867afd-52643/art/20201218_jtZMCbefeaJFaM4W6XfuHuUZ.png";

const IMAGE_DETAIL_ROOMS = "https://bit.ly/long-bot1";

const IMAGE_GIF_WELCOME = "https://bit.ly/eric-bot-1-2";
// Handle function

let callSendAPI = async (sender_psid, response) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Construct the message body
      let request_body = {
        recipient: {
          id: sender_psid,
        },
        message: response,
      };

      await sendMarkReadMessage(sender_psid);
      await sendTypingOn(sender_psid);

      // Send the HTTP request to the Messenger Platform
      request(
        {
          uri: "https://graph.facebook.com/v18.0/me/messages",
          qs: { access_token: PAGE_ACCESS_TOKEN },
          method: "POST",
          json: request_body,
        },
        (err, res, body) => {
          console.log("****************");
          console.log("check body :", body);
          console.log("****************");
          if (!err) {
            resolve("message sent!");
          } else {
            console.error("Unable to send message:" + err);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};

let sendTypingOn = (sender_psid) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: "typing_on",
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
        console.log("sendTypingOn sent!");
      } else {
        console.error("Unable to send sendTypingOn :" + err);
      }
    }
  );
};

let sendMarkReadMessage = (sender_psid) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: "mark_seen",
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
        console.log("sendTypingOn sent!");
      } else {
        console.error("Unable to send sendTypingOn :" + err);
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
      //let response2 = getStartedTemplate();
      // send an Image
      let response2 = getImageGetStartedTemplate();
      let response3 = getStartedQuickReplyTempalte();
      // send text message
      await callSendAPI(sender_psid, response1);

      // send an image
      await callSendAPI(sender_psid, response2);

      //send a quick reply
      await callSendAPI(sender_psid, response3);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let getStartedTemplate = (senderID) => {
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
                type: "web_url",
                url: `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                title: "ĐẶT BÀN",
                webview_height_ratio: "tall",
                messenger_extensions: true,
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

let getImageGetStartedTemplate = () => {
  let response = {
    attachment: {
      type: "image",
      payload: {
        url: IMAGE_GIF_WELCOME,
        is_reusable: true,
      },
    },
  };
  return response;
};
let getStartedQuickReplyTempalte = () => {
  let response = {
    text: "Dưới đây là các lựa chọn của nhà hàng :",
    quick_replies: [
      {
        content_type: "text",
        title: "MENU CHÍNH",
        payload: "MAIN_MENU",
      },
      {
        content_type: "text",
        title: "HD SỬ DỤNG BOT",
        payload: "GUIDE_TO_USE",
      },
    ],
  };
  return response;
};

let handleSendMainMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getMainMenuTemplate(sender_psid);

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let getMainMenuTemplate = (senderID) => {
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
                type: "web_url",
                url: `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
                title: "ĐẶT BÀN",
                webview_height_ratio: "tall",
                messenger_extensions: true,
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
                title: "CHI TIẾT",
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

let handleBackToMainMenu = async (sender_psid) => {
  await handleSendMainMenu(sender_psid);
};

let handleDetailViewAppetizers = async (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getDetailViewAppetizerTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let handleDetailViewFish = async (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getDetailViewFishTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let handleDetailViewMeat = async (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response1 = getDetailViewMeatTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailViewAppetizerTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Khoai tây chiên",
            subtitle: "100.000đ/1 phần",
            image_url: IMAGE_DETAIL_APPETIZER_1,
          },

          {
            title: "Hoa chuối trộn",
            subtitle: "150.000đ/1 phần",
            image_url: IMAGE_DETAIL_APPETIZER_2,
          },

          {
            title: "Gân bò bóp chua",
            subtitle: "180.000đ/1 phần",
            image_url: IMAGE_DETAIL_APPETIZER_3,
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

let getDetailViewFishTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Cá hồi Châu Âu",
            subtitle: "450.000đ/1 kg",
            image_url: IMAGE_DETAIL_FISH_1,
          },

          {
            title: "Cá ngừ đại dương",
            subtitle: "570.000đ/1 kg",
            image_url: IMAGE_DETAIL_FISH_2,
          },

          {
            title: "Cá mú",
            subtitle: "500.000đ/1 kg",
            image_url: IMAGE_DETAIL_FISH_3,
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

let getDetailViewMeatTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Thịt bò kobe",
            subtitle: "1.120.000đ/1 phần",
            image_url: IMAGE_DETAIL_MEAT_1,
          },

          {
            title: "Thịt cừu",
            subtitle: "200.000đ/1 phần",
            image_url: IMAGE_DETAIL_MEAT_2,
          },

          {
            title: "Thịt heo hun khói",
            subtitle: "290.000đ/1 phần",
            image_url: IMAGE_DETAIL_MEAT_3,
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

let getButtonRoomsTemplate = (senderID) => {
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
            type: "web_url",
            url: `${process.env.URL_WEB_VIEW_ORDER}/${senderID}`,
            title: "ĐẶT BÀN",
            webview_height_ratio: "tall",
            messenger_extensions: true,
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
      let response1 = getImageRoomsTemplate(sender_psid);
      // send a button templates : text, button
      let response2 = getButtonRoomsTemplate(sender_psid);
      await callSendAPI(sender_psid, response1);
      await callSendAPI(sender_psid, response2);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let handleGuideToUseBot = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      // send text message
      let username = await getUserName(sender_psid);
      let response1 = {
        text: `Xin chào mừng bạn ${username} , mình là chatbot nhà hàng Peter.\nĐể biết thêm thông tin, bạn vui lòng xem video bên dưới 😀👌`,
      };
      // send a media templates : video, button
      let response2 = getBotMediaTemplate(sender_psid);
      await callSendAPI(sender_psid, response1);
      await callSendAPI(sender_psid, response2);

      resolve("done");
    } catch (e) {
      reject(e);
    }
  });
};

let getBotMediaTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "media",
        elements: [
          {
            media_type: "video",
            //attachment_id: "1078313096531843",

            url: "https://business.facebook.com/Peter%20Restaurant/videos/1078313096531843",
            buttons: [
              {
                type: "postback",
                title: "MENU CHÍNH",
                payload: "MAIN_MENU",
              },

              {
                type: "web_url",
                title: "Test cho Long chat bot",
                url: "https://www.youtube.com/watch?v=A-tX5PI3V0o",
                webview_height_ratio: "full",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};
module.exports = {
  handleGetStarted,
  handleSendMainMenu,
  handleSendBreakFastMenu,
  handleSendLunchMenu,
  handleSendDinnerMenu,
  handleBackToMainMenu,
  handleDetailViewAppetizers,
  handleDetailViewFish,
  handleDetailViewMeat,
  handleShowDetailRooms,
  callSendAPI,
  getUserName,
  handleGuideToUseBot,
};
