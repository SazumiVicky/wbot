const syntaxerror = require("syntax-error");
const util = require("util");
const { msg } = require("../../config.js");

module.exports = {
  name: "eval",
  description: "Eval",
  cmd: ["=>", ">"],
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

    const arg = m.commandWithoutPrefix == ">" ? m.args.join(" ") : "return " + m.args.join(" ");
    try {
      var txtt = util.format(await eval(`(async()=>{ ${arg} })()`));
      await sock.sendMessage(m.from, { text: txtt }, { quoted: m });
    } catch (e) {
      let _syntax = "";
      let _err = util.format(e);
      let err = syntaxerror(arg, "EvalError", {
        allowReturnOutsideFunction: true,
        allowAwaitOutsideFunction: true,
        sourceType: "module",
      });
      if (err) _syntax = err + "\n\n";
      await sock.sendMessage(m.from, { text: util.format(_syntax + _err) }, { quoted: m });
    } 
  },
};
