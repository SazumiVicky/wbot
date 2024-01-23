/*
* dev: Sazumi Viki
* github: github.com/sazumivicky
* instagram: @moe.sazumiviki
* web: www.sazumi.moe
*/

const { react } = require("../../config.js");
const Message = require("../../file/func/Message.js");

const startTime = new Date();

module.exports = {
  name: "runtime",
  description: "Bot Runtime",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "info",
    example : "*/none*",
  },
  cmd: ["runtime"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });
    message.react(react.process);
    const currentTime = new Date();
    const timeDifference = currentTime - startTime;

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    const replyText = `*🍥 Bot has been active for:* ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

    await message.react(react.success);
    await sock.sendMessage(m.from, { text: replyText }, { quoted: m }).catch(() => {
      message.react(react.failed);
    });
  },
};