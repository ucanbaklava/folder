import { createOrGetUser } from "~~/server/utils/auth";

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    const { email, name, avatar_url: avatar } = user;
    const registeredUser = await createOrGetUser({
      name,
      email,
      avatar,
      provider: "github",
      email_verified: true,
    });
    await setUserSession(event, { user: registeredUser });
    return sendRedirect(event, "/");
  },
});
