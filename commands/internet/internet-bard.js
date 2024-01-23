/*
* dev: Sazumi Viki
* github: github.com/sazumivicky
* instagram: @moe.sazumiviki
* web: www.sazumi.moe
*/

const axios = require("axios");
const { react, apis } = require("../../config.js");
const Message = require("../../file/func/Message.js");

module.exports = {
  name: "bard",
  description: "Bard AI Text Processing",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "internet",
    example : "*/teks*",
  },
  cmd: ["bard"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });

    if (!m.arg) {
      await message.react(react.failed);
      return sock.sendMessage(m.from, { text: "*Example:* .bard tutorial on getting a life partner" }, { quoted: m });
    }

    const skizoApi = apis.sazumiviki;
    const apiUrl = `https://skizo.tech/api/bard-ai?text=${encodeURIComponent(m.arg)}&apikey=${skizoApi.apikey}`;

    try {
      await message.react(react.process);

      const response = await axios.get(apiUrl, { responseType: "json" });
      if (response.data && response.data.content) {
        await sock.sendMessage(m.from, { text: response.data.content }, { quoted: m });
        await message.react(react.success);
      } else {
        throw new Error("🍥 Upps Erorr");
      }
    } catch (error) {
      console.error(error);
      await message.react(react.failed);
      await sock.sendMessage(
        m.from,
        { text: "🍥 Upps Erorr" },
        { quoted: m }
      );
    }
  },
};
