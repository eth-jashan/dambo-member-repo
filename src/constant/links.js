export const links = {
    discord_oauth: {
        local: "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Ffallback&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.members.read",
        staging:
            "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=https%3A%2F%2Fstaging.app.drepute.xyz%2Fdiscord%2Ffallback&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.members.read",
        production:
            "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=https%3A%2F%2Fapp.drepute.xyz%2Fdiscord%2Ffallback&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.members.read",
    },
    contributor_invite: {
        local: "http://localhost:3000/contributor/invite/",
        dev: "https://staging.app.drepute.xyz/contributor/invite/",
    },
    discord_fallback: {
        local: "http://localhost:3000/discord/fallback",
        staging: "https://staging.app.drepute.xyz/discord/fallback",
    },
    discord_add_bot: {
        local: "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&permissions=8&scope=bot%20applications.commands&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Fadd-bot-fallback&response_type=code",
        staging:
            "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&permissions=8&redirect_uri=https%3A%2F%2Fstaging.app.drepute.xyz%2Fdiscord%2Fadd-bot-fallback&response_type=code&scope=identify%20bot%20applications.commands",
    },
}
// "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&permissions=8&scope=bot%20applications.commands&redirect_uri=https%3A%2F%2Fstaging.app.drepute.xyz%2Fdiscord%2Fadd-bot-fallback&response_type=code",
