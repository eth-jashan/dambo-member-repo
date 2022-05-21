const routes = {
    auth: {
        getNonce: "/auth/nonce",
        getSignature: "/auth/signature",
    },
    dao: {
        getDao: "/dao/",
        getOurSafes: "/dao/our-safes",
        registerDao: "/dao/register",
        getCommunityRole: "/dao/community-roles",
        joinContributor: "/dao/join",
        getDaoMembership: "/dao/memberships",
        getRole: "/dao/my-role",
    },
    contribution: {
        createContri: "/contrib",
        updatePayout: "/contrib/payout/update",
        payout: "/contrib/payout",
        externalPayout: "/contrib/external_payout",
        signPayout: "/contrib/payout/sign",
        execute: "/contrib/payout/execute",
        reject: "/contrib/payout/reject",
    },
    pocp: {
        relay: "/eth/relay",
    },
    discord: {
        register: "/discord/register",
        identifierStatus: "/discord/identifier/status",
        userId: "/discord/user_id",
    },
}

export default routes
