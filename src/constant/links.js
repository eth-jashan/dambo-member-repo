export const links = {
    discord_oauth :{
        local: 'https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Ffallback&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.members.read',
        //staging: 'https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Ffallback&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.members.read',
        staging:'https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=https%3A%2F%2Fstaging.app.drepute.xyz%2Fdiscord%2Ffallback&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.members.read'
    },
    contributor_invite:{
        local:'http://localhost:3000/contributor/invite/',
        // dev:'http://localhost:3000/contributor/invite/'
        dev:'https://staging.app.drepute.xyz/contributor/invite/'
    }
}