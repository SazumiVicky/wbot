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
  name: "fbdl",
  description: "Download Facebook Media",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "Downloader",
    example : "*/link*",
  },
  cmd: ["fbdl", "facebookdl", "fb"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });

    const fbUrl = m.arg;

    if (!fbUrl) {
      await message.react(react.failed);
      return sock.sendMessage(m.from, { text: "*Example:* .fbdl https://www.facebook.com/xxxxxx" }, { quoted: m });
    }

    try {
      message.react(react.process);

      const skizoApi = apis.sazumiviki;
      const apiUrl = `https://skizo.tech/api/facebook?url=${encodeURIComponent(fbUrl)}&apikey=${skizoApi.apikey}`;
      const response = await axios.get(apiUrl, { responseType: "json" });

      if (response.data && response.data.medias && response.data.medias.length > 0) {
        const media = response.data.medias[0];

        if (media.url.includes('.mp4')) {
          await sock.sendMessage(
            m.from,
            {
              video: { url: media.url },
              caption: `${response.data.title}`,
            },
            { quoted: m }
          ).catch((err) => {
            console.error(err);
          });
        } else {
          await sock.sendMessage(
            m.from,
            {
              image: { url: media.url },
              caption: `${response.data.title}`,
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