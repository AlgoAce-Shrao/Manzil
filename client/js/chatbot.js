// client/js/chatbot.js
async function sendChat(message) {
  try {
    const res = await apiPost('/ai/chat', { message });
    return res.reply;
  } catch (err) {
    return 'AI error: ' + err.message;
  }
}
