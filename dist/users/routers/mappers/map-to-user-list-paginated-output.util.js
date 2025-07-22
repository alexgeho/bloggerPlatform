"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToUserListPaginatedOutput = mapToUserListPaginatedOutput;
function mapToUserListPaginatedOutput(users, meta) {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: users.map(function (user) { return ({
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: new Date().toISOString()
        }); }),
    };
}
//# sourceMappingURL=map-to-user-list-paginated-output.util.js.map