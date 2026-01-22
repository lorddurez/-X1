const config = require("../config");

module.exports = async (sock, msg) => {
  const text =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    "";

  if (!text.startsWith(config.prefix)) return;

  const command = text.slice(1).trim().split(" ")[0].toLowerCase();
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || from;

  switch (command) {

    case "menu":
      await sock.sendMessage(from, {
        text: `
╔═『 ${config.botName} 』
║ .vv
║ .autoviewstatus on/off
║ .autotyping on/off
║ .autoreact on/off
║ .ping
║ .owner
║ .alive
║ .block
║ .unblock
║ .tagall
╚════════════`
      });
      break;

    case "ping":
      await sock.sendMessage(from, { text: "🏓 Pong!" });
      break;

    case "owner":
      await sock.sendMessage(from, {
        text: `${config.ownerName}\nhttps://wa.me/${config.ownerNumber}`
      });
      break;

    case "alive":
      await sock.sendMessage(from, {
        text: `🤖 ${config.botName} is alive!\nOwner: ${config.ownerName}`
      });
      break;

    case "block":
      await sock.updateBlockStatus(sender, "block");
      await sock.sendMessage(from, { text: "🚫 User blocked" });
      break;

    case "unblock":
      await sock.updateBlockStatus(sender, "unblock");
      await sock.sendMessage(from, { text: "✅ User unblocked" });
      break;

    case "tagall":
      if (!from.endsWith("@g.us")) return;
      const group = await sock.groupMetadata(from);
      const mentions = group.participants.map(p => p.id);
      await sock.sendMessage(from, {
        text: "📢 TAG ALL",
        mentions
      });
      break;

    default:
      break;
  }
};
