import { AuthApi, OauthType } from 'src/apis/first-approval-api'

export class AuthStore {
  token: string | undefined

  exchangeToken (code: string): void {
    const authService = new AuthApi()
    authService.authorize({ code, type: OauthType.GOOGLE }).then(response => {
      this.token = response.data.token
    }).catch(e => {
      console.error(e)
    })
  }
}

export const loadAuthUrls = async (): Promise<{ google?: string }> => {
  const authService = new AuthApi()
  const urls = await authService.authorizationLinks()
  return urls.data
}
