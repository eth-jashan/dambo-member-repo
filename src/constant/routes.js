const routes = {
    auth:{
        getNonce:'/auth/nonce',
        getSignature:'/auth/signature'
    },
    dao:{
        getDao:'/dao/',
        getOurSafes:'/dao/our-safes',
        registerDao:'/dao/register',
        getCommunityRole:'/dao/community-roles',
        joinContributor:'/dao/join',
        getDaoMembership:'/dao/memberships',
        getRole:'/dao/my-role'
    },
    contribution:{
        createContri:'/contrib'
    }
}

export default routes