require("dotenv").config();
import request from "request";
import chatbotService from "../services/chatbotService";
import { GoogleSpreadsheet } from "google-spreadsheet";
import moment from "moment";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const SPEADSHEET_ID = process.env.SPEADSHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

let writeDataToGoogleSheet = async (data) => {
  let currentdate = new Date();
  const format = "HH:mm DD/MM/YYYY";
  let formatedDate = moment(currentdate).format(format);

  // Initialize the sheet - doc ID is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(SPEADSHEET_ID);

  // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    client_email: JSON.parse(`"${GOOGLE_SERVICE_ACCOUNT_EMAIL}"`),
    private_key: JSON.parse(`"${GOOGLE_PRIVATE_KEY}"`),
  });

  await doc.loadInfo(); // loads document properties and worksheets

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

  // append rows
  await sheet.addRow({
    "Tên Facebook": data.username,
    "Địa chỉ Email": data.email,
    "Số điện thoại": data.phoneNumber,
    "Thời gian": formatedDate,
    "Tên khách hàng": data.customerName,
  });
};

let getHomePage = (req, res) => {
  return res.render("homepage.ejs");
};

let setupProfile = async (req, res) => {
  let request_body = {
    get_started: { payload: "GET_STARTED" },
    whitelistes_domains: ["https://long-chat-bot.onrender.com/"],
  };

  await request(
    {
      uri: `https://graph.facebook.com/v18.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      console.log(body);
      if (!err) {
        console.log("Setup user profile succeed !");
      } else {
        console.error("Unable to Setup user profile:" + err);
      }
    }
  );
  return res.send("Setup user profile succeed !");
};

let postWebhook = (req, res) => {
  let body = req.body;

  console.log(` \ u{ 1F7EA } Received webhook :`);
  console.dir(body, { depth: null });

  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
};

let getWebhook = (req, res) => {
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

// Handles message events
function handleMessage(sender_psid, received_message) {
  let response;

  if (received_message.text) {
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an attachment!`,
    };
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Is this the right picture?",
              subtitle: "Tap a button to answer.",
              image_url: attachment_url,
              buttons: [
                {
                  type: "postback",
                  title: "Yes!",
                  payload: "yes",
                },
                {
                  type: "postback",
                  title: "No!",
                  payload: "no",
                },
              ],
            },
          ],
        },
      },
    };
  }

  // Send the response message
  callSendAPI(sender_psid, response);
}

// Handle messaging_postback events
async function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  switch (payload) {
    case "yes":
      response = { text: "Thanks!" };
      break;
    case "no":
      response = { text: "Oops, try sending another image." };
      break;

    case "RESTART_BOT":
    case "GET_STARTED":
      await chatbotService.handleGetStarted(sender_psid);
      break;

    case "MAIN_MENU":
      await chatbotService.handleSendMainMenu(sender_psid);
      break;

    case "BREAK_FAST_MENU":
      await chatbotService.handleSendBreakFastMenu(sender_psid);
      break;
    case "LUNCH_MENU":
      await chatbotService.handleSendLunchMenu(sender_psid);
      break;
    case "DINNER_MENU":
      await chatbotService.handleSendDinnerMenu(sender_psid);
      break;

    case "VIEW_BREAK_FAST":
    case "VIEW_PHO":
    case "VIEW_BUN":
    case "VIEW_BREAD":

    case "VIEW_APPETIZERS":
      await chatbotService.handleDetailViewAppetizers(sender_psid);
      break;
    case "VIEW_FISH":
      await chatbotService.handleDetailViewFish(sender_psid);
      break;
    case "VIEW_MEAT":
      await chatbotService.handleDetailViewMeat(sender_psid);
      break;

    case "BACK_TO_MAIN_MENU":
      await chatbotService.handleBackToMainMenu(sender_psid);
      break;

    case "SHOW_ROOMS":
      await chatbotService.handleShowDetailRooms(sender_psid);
      break;

    default:
      response = {
        text: `Opp ! I don't know response with postback ${payload}`,
      };
  }

  // // Send the message to acknowledge the postback
  // callSendAPI(sender_psid, response);
}

// Sends response messages via the send API
function callSendAPI(sender_psid, response) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
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
}

let setupPersistentMenu = async (req, res) => {
  let request_body = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "web_url",
            title: "Test cho Long chat bot",
            url: "https://www.youtube.com/watch?v=A-tX5PI3V0o",
            webview_height_ratio: "full",
          },
          {
            type: "web_url",
            title: "Page Long bui Restaurant",
            url: "https://www.facebook.com/profile.php?id=61552617513254",
            webview_height_ratio: "full",
          },
          {
            type: "postback",
            title: "Khởi động lại bot",
            payload: "RESTART_BOT",
          },
        ],
      },
    ],
  };

  await request(
    {
      uri: `https://graph.facebook.com/v18.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      console.log(body);
      if (!err) {
        console.log("Setup persistent menu succeed !");
      } else {
        console.error("Unable to Setup user profile:" + err);
      }
    }
  );
  return res.send("Setup persistent menu succeed !");
};

let handleReserveTable = (req, res) => {
  let senderId = req.params.senderId;
  return res.render("reserve-table.ejs", {
    senderId: senderId,
  });
};

let handlePostReserveTable = async (req, res) => {
  try {
    let username = await chatbotService.getUserName(req.body.psid);

    // write data to excel google sheet
    let data = {
      username: username,
      email: req.body.email,
      phoneNumber: `'${req.body.phoneNumber}`,
      customerName: req.body.customerName,
    };
    await writeDataToGoogleSheet(data);

    let customerName = "";
    if (req.body.customerName === "") {
      customerName = username;
    } else customerName - req.body.customerName;

    // I demo response with sample text
    // you can check database for customer orther's status
    let response1 = {
      text: `---Thông tin khách hàng đặt bàn---
      \nHọ và tên : ${customerName}
      \nĐịa chỉ email : ${req.body.email}
      \nSố điện thoại : ${req.body.phoneNumber}
      `,
    };
    await chatbotService.callSendAPI(req.body.psid, response1);
    return res.status(200).json({
      message: "OK",
    });
  } catch (e) {
    console.log("Lỗi post reserve table :", e);
    return res.status(200).json({
      message: "Server error",
    });
  }
};
module.exports = {
  getHomePage,
  postWebhook,
  getWebhook,
  setupProfile,
  setupPersistentMenu,
  handleReserveTable,
  handlePostReserveTable,
};
