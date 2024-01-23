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
  name: "tiktokdl",
  description: "Download TikTok Video",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "Downloader",
    example : "*/link*",
  },
  cmd: ["tiktok", "tiktokdl", "tiktok", "tt"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });
    const startTime = Date.now();
    message.react(react.process);

    const tiktokUrl = m.arg;

    if (!tiktokUrl) {
      await message.react(react.failed);
      return sock.sendMessage(m.from, { text: "*Example*: .tiktok https://www.tiktok.com/xxxxx" }, { quoted: m });
    }
    try {
      const skizoApi = apis.sazumiviki;
      const apiUrl = `https://skizo.tech/api/tiktok?url=${encodeURIComponent(tiktokUrl)}&apikey=${skizoApi.apikey}`;
      const response = await axios.get(apiUrl, { responseType: "json" });

      if (response.data && response.data.code === 0 && response.data.data.play) {
        const videoUrl = response.data.data.play;
        const fetchTime = Date.now() - startTime;

        await sock.sendMessage(
          m.from,
          {
            video: { url: videoUrl },
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