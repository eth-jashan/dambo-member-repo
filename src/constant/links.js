export const links = {
    discord_oauth :{
        local: 'https://discord.com/api/oauth2/authorize?client_id=943242563178086540&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Ffallback&response_type=code&scope=identify%20email%20connections%20guilds',
        staging:'https://discord.com/api/oauth2/authorize?client_id=943242563178086540&redirect_uri=https%3A%2F%2Fstaging.app.drepute.xyz%2Fdiscord%2Ffallback&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join'
    },
    contributor_invite:{
        local:'http://localhost:3000/contributor/invite/',
        dev:'https://staging.app.drepute.xyz/contributor/invite/'
    }
}