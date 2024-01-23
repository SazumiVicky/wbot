const { config } = require("../../config.js");

module.exports = {
  name: "sticker",
  cmd: ["s", "stiker", "sticker"],
  tags: ["convert"],
  run: async ({ m, sock }) => {
    const quoted = m.quoted ? m.quoted : m;

    if (/image|video|webp/i.test(quoted.mime)) {
      const buffer = await quoted.download();

      if (m.text == "avatar") config.Exif.isAvatar = 1;
      else config.Exif.isAvatar = 0;

      if (quoted?.msg?.seconds > 10) {
        await sock.sendMessage(m.from, { text: "Max video 9 second" }, { quoted: m });
        return;
      }

      let exif = { ...config.Exif };
      await sock.sendMessage(m.from, buffer, { asSticker: true, ...exif }, { quoted: m });
    } else if (m.mentions[0]) {
      let url = await sock.profilePictureUrl(m.mentions[0], "image");
      await sock.sendMessage(m.from, url, { asSticker: true, ...config.Exif }, { quoted: m });
    } else if (/(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm|gif))/i.test(m.text)) {
      await sock.sendMessage(m.from, config.func.isUrl(m.text)[0], { asSticker: true, ...config.Exif }, { quoted: m });
    } else {
      await sock.sendMessage(m.from, { text: "Send or reply to media" }, { quoted: m });
    }
  },
};
