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
    }
}
`