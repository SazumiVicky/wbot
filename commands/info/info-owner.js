/*
* dev: Sazumi Viki
* github: github.com/sazumivicky
* instagram: @moe.sazumiviki
* web: www.sazumi.moe
*/

const Message = require("../../file/func/Message.js");

module.exports = {
  name: "owner",
  description: "Owner Information",
  options: {
    withoutPrefix: true,
  },
  menu: {
    label: "info",
    example : "*/none*",
  },
  cmd: ["owner", "creator"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });

    const ownerNumber = "6285236226786";
    const ownerVCard =
      "BEGIN:VCARD\n" +
      "VERSION:3.0\n" +
      "FN:Sazumi Viki\n" +
      `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}\n` +
      "END:VCARD";

    try {
      const sentMsg = await sock.sendMessage(
        m.from,
        {
          contacts: {
            displayName: "Sazumi Viki",
            contacts: [{ vcard: ownerVCard }],
          },
        },
        { quoted: m }
      );

      if (sentMsg.status == 200) {
        await sock.sendMessage(m.from, { text: "Owner's contact information has been sent." }, { quoted: sentMsg });
      } else {
      }
    } catch (error) {
      console.error(error);
      await sock.sendMessage(m.from, { text: "🍥 Upps Error" }, { quoted: m });
    }
  },
};
