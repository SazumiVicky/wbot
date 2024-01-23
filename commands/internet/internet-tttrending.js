/*
* dev: Sazumi Viki
* github: github.com/sazumivicky
* instagram: @moe.sazumiviki
* web: www.sazumi.moe
*/

const axios = require('axios');
const { react, apis } = require("../../config.js");
const Message = require("../../file/func/Message.js");

module.exports = {
  name: "tttrending",
  description: "Download trending TikTok media",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "internet",
    example : "*/none*",
  },
  cmd: ["tttrending", "tiktoktrending"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });

    try {
      const startTime = new Date();

      message.react(react.process);

      const skizoApi = apis.sazumiviki;
      const apiUrl = `https://skizo.tech/api/tttrending?region=ID&apikey=${skizoApi.apikey}`;
      const response = await axios.get(apiUrl);

      const endTime = new Date();
      const fetchingTime = endTime - startTime;

      if (response.status === 200 && response.data && response.data.play) {
        const playUrl = response.data.play;

        await sock.sendMessage(
          m.from,
          { video: { url: playUrl }, mimetype: 'video/mp4', caption: `*🍥 Fetching:* ${fetchingTime}ms` },
          { quoted: m }
        );

        await message.react(react.success);
      } else {
        throw new Error("🍥 Failed to fetch trending TikTok media");
      }
    } catch (error) {
      console.error(error);
      await message.react(react.failed);
      await sock.sendMessage(
        m.from,
        { text: "🍥 Failed to fetch trending TikTok media" },
        { quoted: m }
      ).catch((err) => {
        console.error(err);
      });
    }
  },
};