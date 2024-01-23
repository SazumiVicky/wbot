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
  name: "tiktoksearch",
  description: "Search TikTok and Download Video",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "Downloader",
    example : "*/query*",
  },
  cmd: ["ttsearch", "tiktoksearch"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });
    const startTime = Date.now();
    message.react(react.process);

    const query = m.arg;

    if (!query) {
      await message.react(react.failed);
      return sock.sendMessage(m.from, { text: "*Example*: .ttsearch rubia" }, { quoted: m });
    }

    try {
      const skizoApiUrl = "https://skizo.tech/api/ttsearch";
      const apiUrl = `${skizoApiUrl}?search=${encodeURIComponent(query)}&apikey=${apis.sazumiviki.apikey}`;
      const response = await axios.get(apiUrl, { responseType: "json" });

      if (response.data && response.data.play) {
        const { title, play } = response.data;
        const fetchTime = Date.now() - startTime;

        await sock.sendMessage(
          m.from,
          {
            video: { url: play, title: `*Title:* ${title}` },
            caption: `*🍥 Fetching:* ${fetchTime}ms`,
          },
          { quoted: m }
        );

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