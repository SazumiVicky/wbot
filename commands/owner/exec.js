const { exec } = require("child_process");
const util = require("util");
const { msg } = require("../../config.js");

module.exports = {
  name: "exec",
  description: "Exec",
  cmd: ["$"],
  menu: {
    label: "Owner",
    example: "*/code*"
  },
  options: {
    withoutPrefix: true,
  },
  run: async ({ m, sock }) => {
    if (!m.isOwner) {
      await sock.sendMessage(m.from, { text: msg.isOwner }, { quoted: m });
      return;
    }
    try {
      exec(m.args.join(" "), function (er, st) {
        if (er) sock.sendMessage(m.from, { text: util.format(er.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "")) }, { quoted: m });
        if (st) sock.sendMessage(m.from, { text: util.format(st.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "")) }, { quoted: m });
      });
    } catch (e) {
      console.log(e);
    }
  },
};
