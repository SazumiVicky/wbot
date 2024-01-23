const { msg } = require("../../config.js");
const Message = require("../../file/func/Message.js");

module.exports = {
  name: "group-kick",
  description: "Kick member from group",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "Group",
    example : "*/reply*",
  },
  cmd: ["kick"],
  run: async ({ m, sock }) => {
    if (!m.isGroup) return m.reply(msg.isGroup);
    if (!m.isAdmin) return m.reply(msg.isAdmin);
    if (!m.isBotAdmin) return m.reply(msg.isBotAdmin);

    let user = m.mentions[0] ?? m.quoted?.sender;
    if (!user)
      return m.reply(`*Example:* ${m.prefix}kick @user or reply to the message`);

    try {
      message.react(react.success);
      await sock.groupParticipantsUpdate(m.from, [user], "remove");
    } catch {
      message.react(react.failed);
    }
  },
};
