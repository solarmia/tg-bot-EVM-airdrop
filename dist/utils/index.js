"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorAddr = void 0;
const validatorAddr = (address) => {
    return /^0x[0-9a-fA-F]{40}$/.test(address);
};
exports.validatorAddr = validatorAddr;
//# sourceMappingURL=index.js.map