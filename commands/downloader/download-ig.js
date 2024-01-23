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
  name: "igdl",
  description: "Download Instagram Media",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "Downloader",
    example : "*/link*",
  },
  cmd: ["ig", "igdl", "instagram"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });

    const igUrl = m.arg;

    if (!igUrl) {
      await message.react(react.failed);
      return sock.sendMessage(m.from, { text: "*Example:* .ig https://www.instagram.com/xxxxx" }, { quoted: m });
    }

    try {
      message.react(react.process);

      const skizoApi = apis.sazumiviki;
      const apiUrl = `https://skizo.tech/api/igdl?url=${encodeURIComponent(igUrl)}&apikey=${skizoApi.apikey}`;
      const response = await axios.get(apiUrl, { responseType: "json" });

      if (response.data && response.data.media && response.data.media.length > 0) {
        const mediaUrl = response.data.media[0];

        if (mediaUrl.includes('.mp4')) {
          await sock.sendMessage(
            m.from,
            {
              video: { url: mediaUrl },
              caption: `${response.data.caption}`,
            },
            { quoted: m }
          ).catch((err) => {
            console.error(err);
          });
        } else {
          await sock.sendMessage(
            m.from,
            {
              image: { url: mediaUrl },
              caption: `${response.data.caption}`,
            },
            { quoted: m }
          ).catch((err) => {
            console.error(err);
          });
        }

        await message.react(react.success);
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
