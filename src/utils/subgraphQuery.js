export const POCP_CLAIMED_TOKEN = `
query{
    pocpTokens(
      first:100 
      orderBy: id 
      orderDirection:desc
    ) {
      id
      ipfsMetaUri
      claimer
      approver
      community{
        id
      }
    }
}
`

export const COMMUNITY_HASH = `
  {
    communities(first:100){
      id
      txhash
    }
  }
`

export const POCP_APPROVED_TOKEN = `
{
  approvedTokens(first:100) {
    id
    community {
      id
    }
    identifier
  }
}
`