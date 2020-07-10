# sdd-back

## Auth logic

Logic is inspired of this tutorial https://www.youtube.com/watch?v=25GS0MLT8JU

<b>/graphql login</b>
- Returns an <b>accessToken</b> string to be stored in FE
- Returns a <b>refreshToken</b> cookie

<b>/refresh-token (POST)</b>
- Check the validity and version of the refreshToken
- Returns new accessToken / refreshToken
- FE can call this for each page to maintain login as long as the user is active

<b>/graphql revokeRefreshTokensForUser</b>
- To be called for a resetPassword or an acccount hacked
- Increments the tokenVersion for a user, that will invalidate the refresh-token query
