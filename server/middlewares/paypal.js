import paypalSDK from "paypal-rest-sdk";
import "dotenv/config";

paypalSDK.configure({
  mode: process.env.PAYPAL_MODE || "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

export default paypalSDK;
