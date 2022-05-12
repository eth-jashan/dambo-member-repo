const api = {
    drepute: {
        dev: {
            BASE_URL: "https://staging.api.drepute.xyz/dao_tool_server",
        },
    },
    pocp_service: {
        BASE_URL: "http://localhost:5000/",
    },
    coinbase: {
        prices: "https://api.coinbase.com/v2/prices/",
    },
    s3Uplaod: {
        url: "https://qs17tofrz7.execute-api.us-east-1.amazonaws.com/uploads?",
    },
    subgraph: {
        url: "https://api.thegraph.com/subgraphs/id/QmctWyJKqKwU7XJmxK8c1MA3BW4YPEzN8LbSmECcP8N6gk",
    },
    ipfs: {
        // url:'https://staging.api.drepute.xyz:5001'
        url: "https://localhost:3001",
    },
}

export default api
