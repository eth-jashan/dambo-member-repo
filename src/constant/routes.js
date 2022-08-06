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
        updateDao: "/dao/update",
        updateUser: "/dao/update/user",
    },
    contribution: {
        createContri: "/contrib",
        createSchema: "/contrib/add_contrib_schema",
        updatePayout: "/contrib/payout/update",
        payout: "/contrib/payout",
        externalPayout: "/contrib/external_payout",
        signPayout: "/contrib/payout/sign",
        execute: "/contrib/payout/execute",
        reject: "/contrib/payout/reject",
        pastContributions: "/contrib/past_contribs",
    },
    pocp: {
        relay: "/eth/relay",
        collectibleInfo: "/eth/collectible",
    },
    discord: {
        register: "/discord/register",
        identifierStatus: "/discord/identifier/status",
        userId: "/discord/user_id",
        toggleBot: "/discord/toggle_active",
    },
    membership: {
        getMembershipBadgesList: "/membership",
        getMembershipVoucher: "/membership/voucher",
        createMembershipBadges: "/membership",
        getCommunityMembers: "/community",
        createMembershipVoucher: "/membership/voucher",
        unclaimedVouchers: "/membership/non_member_unclaimed_vouchers",
    },
    arweave: {
        membership: "/membership",
    },
}

export default routes
