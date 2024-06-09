require("dotenv").config();
module.exports = {
    TOKEN: process.env.TOKEN || "",  // your bot token
    EMBED_COLOR: process.env.EMBED_COLOR || "#4287f5", //<= default is "#000001"
    OWNER_ID: process.env.OWNER_ID || "", //your owner discord id example: "515490955801919488"
    DEV_ID: [], // if you want to use command bot only, you can put your id here example: ["123456789", "123456789"]
    Server_Id: process.env.Server_Id || "",
    TicketChannelUrl: process.env.TicketChannelUrl || "",
    ServerIconUrl: process.env.ServerIconUrl || "",
    ServerBannerUrl: process.env.ServerBannerUrl || ""
}