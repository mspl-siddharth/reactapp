import admin from "../utils/firebase.js";

export const sendNotification = async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    if (!token) {
      return res.status(400).json({ message: "FCM token is required" });
    }

    const message = {
      notification: {
        title: title || "Default Title",
        body: body || "Default Body",
      },
      data: data || {},
      token,
    };

    const response = await admin.messaging().send(message);
    res.json({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
