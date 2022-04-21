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
  approvedTokens(first:1000) {
    id
    community {
      id
    }
    identifier
  }
}
`

export const POCP_COMMUNTIES_TX_HASH = `
{
  communities(first:1000){
    id
    txhash
  }
}`