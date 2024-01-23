const { react } = require("../../config.js");
const Message = require("../../file/func/Message.js");
const yts = require('yt-search');

module.exports = {
  name: "ytsearch",
  description: "Search YouTube",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "Downloader",
    example : "*/query*",
  },
  cmd: ["ytsearch"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });

    const searchQuery = m.arg;

    if (!searchQuery) {
      await message.react(react.failed);
      return sock.sendMessage(m.from, { text: "*Example:* .ytsearch rubia" }, { quoted: m });
    }

    try {
      message.react(react.process);

      const result = await yts(searchQuery);
      const videos = result.videos.slice(0, 10);

      if (videos.length > 0) {
        let responseText = "";

        for (let i = 0; i < videos.length; i++) {
          const video = videos[i];

          responseText += `${i + 1}. *Title:* ${video.title}\n`;
          responseText += `◦ *Link:* ${video.url}\n`;
          responseText += `◦ *Duration:* ${video.timestamp}\n`;
          responseText += `◦ *Uploaded:* ${video.ago}\n`;
          responseText += `◦ *Views:* ${video.views}\n\n`;
        }

        await sock.sendMessage(
          m.from,
          { text: responseText },
          { quoted: m }
        );

        await message.react(react.success);
      } else {
        throw new Error("🍥 No search results found");
      }
    } catch (error) {
      console.error(error);
      await message.react(react.failed);
      await sock.sendMessage(
        m.from,
        { text: "🍥 No search results found" },
        { quoted: m }
      ).catch((err) => {
        console.error(err);
      });
    }
  },
};