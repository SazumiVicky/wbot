const limit = {
  free: 15,
  premium: 150,
  VIP: "Infinity",
  download: {
    free: 50000000,
    premium: 350000000,
    VIP: 1130000000,
  }
}

module.exports = {
  sessionName: 'session',
  prefixs: ['!', '#', '/', '.'],
  owner: ['6285236226786'],
  apis: {
    sazumiviki: {
      endpoint: "https://skizo.tech",
      apikey: "sazumi",
      skizo: {
        key: "YOUR_SKIZO_KEY",
      },
    }
  },
  temp: __dirname + "/temp",
  database: "database.json",
  msg: {
    isAdmin: "This feature is only for admins group",
    isGroup: "This feature is only for groups",
    isOwner: "This feature is only for owners",
    isBotAdmin: "Make the bot admin first",
  },
  react: {
    process: '🕒',
    success: '✅',
    failed: '❌' 
  },
  limit,
};