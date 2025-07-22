"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToUserOutput = mapToUserOutput;
function mapToUserOutput(user) {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: new Date().toISOString()
    };
}
//# sourceMappingURL=map-to-user-output.util.js.map