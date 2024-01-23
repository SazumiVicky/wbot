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
  name: "ytmp4",
  description: "Download YouTube Video",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "Downloader",
    example : "*/link*",
  },
  cmd: ["ytmp4"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });

    const youtubeUrl = m.arg;

    if (!youtubeUrl) {
      await message.react(react.failed);
      return sock.sendMessage(m.from, { text: "*Example:* .ytmp4 https://www.youtube.com/watch?v=xO9-JS6V2zk" }, { quoted: m });
    }

    try {
      message.react(react.process);

      const skizoApi = apis.sazumiviki;
      const apiUrl = `https://skizo.tech/api/y2mate?url=${encodeURIComponent(youtubeUrl)}&apikey=${skizoApi.apikey}`;
      const response = await axios.get(apiUrl, { responseType: "json" });

      if (response.data && response.data.video) {
        const highestQuality = Object.keys(response.data.video)[0];

        if (highestQuality) {
          const videoUrl = response.data.video[highestQuality].url;

          await sock.sendMessage(
            m.from,
            { video: { url: videoUrl }, mimetype: 'video/mp4' },
            { quoted: m }
          );

          await message.react(react.success);
        } else {
          throw new Error("🍥 No video available");
        }
      } else {
        throw new Error("🍥 Upps Error");
      }
    } catch (error) {
      console.error(error);
      await message.react(react.failed);
      await sock.sendMessage(
        m.from,
        { text: "🍥 Upps Error" },
        { quoted: m }
      ).catch((err) => {
        console.error(err);
      });
    }
  },
};