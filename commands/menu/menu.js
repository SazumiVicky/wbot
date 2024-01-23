const { menuByLabel } = require("../../file/func/loadCommands.js");
const { react } = require("../../config.js");
const Message = require("../../file/func/Message.js");
const { Styles, formatRuntime, getVersionFromPackageJson } = require("../../file/sazumiviki/helper.js");

module.exports = {
  name: "menu",
  description: "Bot menu",
  options: {
    withoutPrefix: true,
  },
  cmd: ["help", "menu"],
  run: async ({ m, sock }) => {
    const message = new Message({ m, sock });
    message.react(react.process);

    const user = db.users[m.sender];

    const runtime = formatRuntime(process.uptime());
    const version = getVersionFromPackageJson();
    const imageUrl = "https://cdn.jsdelivr.net/gh/SazumiVicky/Storage@main/sazumiviki.jpg";
    let captionText = "";
    captionText += `${Styles("I am a bot. Even though I am a bot, I can still help you. Use the commands below if you need my assistance.")}\n\n`;
    captionText += `◦ ${Styles("*Limit :*")} ${Styles(user.limit)}\n`;
    captionText += `◦ ${Styles("*Runtime :*")} ${Styles(runtime)}\n`;
    captionText += `◦ ${Styles("*Date :*")} ${Styles(new Date().toLocaleDateString())}\n`;
    captionText += `◦ ${Styles("*Version :*")} ${Styles(version)}\n\n`;

    menuByLabel.forEach((val, key) => {
      captionText += `┌    *${Styles(key)}*\n`
      val.forEach((v) => {
        captionText += `│ ◦ ${Styles(m.prefix + v.cmd[0])} ${Styles(v.example)}\n`
      })
      captionText += `╰──  –\n\n`
    });
    await sock.sendMessage(
      m.from,
      { image: { url: imageUrl, caption: captionText }, caption: captionText },
      { quoted: m }
    ).catch(() => {
      message.react(react.failed);
    });
  },
};
