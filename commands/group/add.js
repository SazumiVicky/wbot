const { msg, react } = require("../../config.js");
const Message = require("../../file/func/Message.js");

module.exports = {
  name: "group-add",
  description: "Add member from group",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "Group",
    example : "*/number*",
  },
  cmd: ["add"],
  run: async ({ m, sock }) => {
    if (!m.isGroup) return m.reply(msg.isGroup);
    if (!m.isAdmin) return m.reply(msg.isAdmin);
    if (!m.isBotAdmin) return m.reply(msg.isBotAdmin);

    if (!m.arg) return m.reply(`*Example:* _${m.prefix}add 62xxx_`);

    let user = m.arg.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    const message = new Message({ m, sock });
    message.react(react.process);

    await sock
      .groupParticipantsUpdate(m.from, [user], "add")
      .then((res) => {
        if (res[0].content?.attrs?.error == 409) {
          message.react(react.success);
          m.reply("Already a member");
        } else if (res[0].content?.attrs?.error == 403) {
          message.react(react.failed);
          m.reply("This number must be invited manually");
        }
        message.react(react.success);
      })
      .catch(() => {
        message.react(react.failed);
      });
  },
};
