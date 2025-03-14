import { authHandler } from "~~/server/utils/auth";

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event: any, { user }: { user: any }) {
    const { email, name, avatar_url: avatar } = user;
    const authUser = await authHandler({
      name,
      email,
      provider: "github",
      avatar,
    });
    await setUserSession(event, { user: authUser });
    return sendRedirect(event, "/");
  },
});
