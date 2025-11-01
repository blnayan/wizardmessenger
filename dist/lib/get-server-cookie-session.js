"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerCookieSession = void 0;
// Keep as relative path for ts-node
const react_1 = require("react");
const auth_1 = require("./auth");
exports.getServerCookieSession = (0, react_1.cache)((cookie) => {
    return auth_1.auth.api.getSession({
        headers: { cookie },
    });
});
