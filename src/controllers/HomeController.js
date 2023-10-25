require("dotenv").config();
import request from "request";
import chatbotService from "../services/chatbotService";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

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

    case "VIEW_APPETIZERS":
    case "VIEW_FISH":
    case "VIEW_MEAT":
    default:
      response = {
        text: `Opp ! I don't know response with postback ${postback}`,
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
module.exports = {
  getHomePage,
  postWebhook,
  getWebhook,
  setupProfile,
  setupPersistentMenu,
};
