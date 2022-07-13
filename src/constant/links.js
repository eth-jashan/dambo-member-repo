export const links = {
    discord_oauth:
        process.env.NODE_ENV === "production"
            ? "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=https%3A%2F%2Fapp.rep3.gg%2Fdiscord%2Ffallback&response_type=code&scope=identify%20guilds%20guilds.join%20guilds.members.read"
            : process.env.NODE_ENV === "staging"
            ? "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=https%3A%2F%2Fstaging.app.rep3.gg%2Fdiscord%2Ffallback&response_type=code&scope=identify%20guilds%20guilds.members.read"
            : "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Ffallback&response_type=code&scope=identify%20guilds%20guilds.members.read",

    // {
    //     local: "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord%2Ffallback&response_type=code&scope=identify%20guilds%20guilds.members.read",
    //     staging:
    //         "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=https%3A%2F%2Fstaging.app.rep3.gg%2Fdiscord%2Ffallback&response_type=code&scope=identify%20guilds%20guilds.members.read",
    //     production:
    //         "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&redirect_uri=https%3A%2F%2Fapp.rep3.gg%2Fdiscord%2Ffallback&response_type=code&scope=identify%20guilds%20guilds.join%20guilds.members.read",
    // },
    contributor_invite: {
        local: "http://localhost:3000/contributor/invite/",
        dev: "https://staging.app.rep3.gg/contributor/invite/",
    },
    discord_fallback: {
        local: "http://localhost:3000/discord/fallback",
        staging: "https://staging.app.rep3.gg/discord/fallback",
    },
    discord_add_bot:
        process.env.NODE_ENV === "production"
            ? `https://discord.com/api/oauth2/authorize?client_id=950635095465795615&permissions=8&redirect_uri=https%3A%2F%2Fapp.rep3.gg%2Fdiscord%2Fadd-bot-fallback&response_type=code&scope=identify%20bot%20applications.commands`
            : process.env.NODE_ENV === "staging"
            ? "https://discord.com/api/oauth2/authorize?client_id=976409482533961769&permissions=8&redirect_uri=https%3A%2F%2Fstaging.app.rep3.gg%2Fdiscord%2Fadd-bot-fallback&response_type=code&scope=identify%20bot%20applications.commands"
            : "https://discord.com/api/oauth2/authorize?client_id=976410963039371284&permissions=8&redirect_uri=https%3A%2F%2Fstaging.app.rep3.gg%2Fdiscord%2Fadd-bot-fallback&response_type=code&scope=identify%20bot%20applications.commands",

    // temp: {
    //     local: "https://discord.com/api/oauth2/authorize?client_id=976410963039371284&permissions=8&redirect_uri=https%3A%2F%2Fstaging.app.rep3.gg%2Fdiscord%2Fadd-bot-fallback&response_type=code&scope=identify%20bot%20applications.commands",
    //     staging:
    //         "https://discord.com/api/oauth2/authorize?client_id=976409482533961769&permissions=8&redirect_uri=https%3A%2F%2Fstaging.app.rep3.gg%2Fdiscord%2Fadd-bot-fallback&response_type=code&scope=identify%20bot%20applications.commands",
    //     production:
    //         "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&permissions=8&redirect_uri=https%3A%2F%2Fstaging.app.rep3.gg%2Fdiscord%2Fadd-bot-fallback&response_type=code&scope=identify%20bot%20applications.commands",
    // },
}
// "https://discord.com/api/oauth2/authorize?client_id=950635095465795615&permissions=8&scope=bot%20applications.commands&redirect_uri=https%3A%2F%2Fstaging.app.rep3.gg%2Fdiscord%2Fadd-bot-fallback&response_type=code",
