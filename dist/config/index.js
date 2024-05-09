"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.webSite = exports.mongoUrl = exports.botToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
exports.botToken = process.env.TOKEN;
exports.mongoUrl = process.env.MONGO_URL;
exports.webSite = process.env.WEB_SITE_URL;
const init = async () => {
    (0, db_1.connectMongoDB)();
};
exports.init = init;
//# sourceMappingURL=index.js.map