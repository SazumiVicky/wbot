<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="http://cdn.sazumi.moe/file/img-131_Ge8McP.jpg" alt="Sazumi logo"></a>
</p>

<h3 align="center">Whatsapp Bot - @whiskeysockets/baileys</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/sazumivicky/wbot/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/sazumivicky/wbot/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p>This bot has been created by leveraging the [Baileys](https://github.com/WhiskeySockets/Baileys) library, and with the assistance of Node.js, this bot can be utilized.

Additionally, for enhanced functionality and user experience, various features have been integrated, making this bot a versatile and efficient tool for different purposes. Whether it's seamless communication, automated tasks, or personalized interactions, this bot is designed to meet diverse needs with ease.</p>

## 📝 Table of Contents

- [About](#about)
- [Installing](#install)
- [Commands Options](#cmd)
- [Contributor](#contributor)

### 🧐 About <a name = "about"></a>

This project is not entirely the result of my choice, and I am not the person who built this bot to its current state. My role is limited to developing some parts of the code, while the majority of the development is carried out by the main developer, [Ilsyaa](https://github.com/ilsyaa/velixs-bot). 

This collaboration has allowed the project to evolve into what we see today, with contributions from various parties to ensure sustainability and significant feature enhancements.

### ✅ Prerequisites

Before installing this bot, it is mandatory for you to have a hosting space for the bot in advance. As a basic example, I am using [Railway](https://www.railway.app) to deploy my WhatsApp bot.

### 🚀 Installing <a name = "install"></a>

To initiate the installation dependencies on Railway, you need to create a Dockerfile beforehand, or you can use manual commands as an alternative.

```
npm install
```

Once you have finished installing the bot dependencies, run it with:

```
node index.js
```

### ⚙️ Commands Options <a name = "cmd"></a>

```javascript
module.exports = {
    name : "menu", // Use lowercase letters and hyphens, avoid spaces, and ensure uniqueness
    description : "This is menu bot", // Feature explanation, content is free to be filled

    // If you delete this command line, these commands will run whenever there is an incoming message, regardless of its content. You can check in the commands/_ folder for more details.
    cmd : ['help', 'menu'],

    // option : Add this to automatically display it on the menu list.
    menu : {
        label : 'translate', // This is for grouping based on labels.
        example : "_en text_", // This is an example of usage; later, in the menu, it will appear as !help en text.
    },

    options : {
        // You can add this option if you want the feature to work without using a prefix.
        withoutPrefix : true
    },

    run : async({ m, sock}) => {
        if(!m.isGroup) return m.reply("This feature can only be used in groups.")
        if(!m.isAdmin) return m.reply("This feature is only for administrators.")
        if(!m.isBotAdmin) return m.reply("The bot must be an admin.")


        // any code
    }
}
```
See also the list of [contributors](https://github.com/sazumivicky/wbot) who participated in this project.

### 🤝 Contributor <a name = "contributor"></a>

- [Ilsyaa](https://github.com/ilsyaa)
- [Sazumi Viki](https://github.com/sazumivicky)
- [sazumiFile](https://cdn.sazumi.moe)
- [Skizo's Apis](https://skizo.tech)
- [@whiskeySockets/baileys](https://github.com/WhiskeySockets/Baileys)
