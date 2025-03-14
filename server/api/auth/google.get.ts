import { authHandler } from "~~/server/utils/auth";

export default defineOAuthGoogleEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event: any, { user }: { user: any }) {
    const { email, name, picture: avatar } = user;
    const authUser = await authHandler({
      name,
      email,
      provider: "google",
      avatar,
    });
    await setUserSession(event, { user: authUser });
    return sendRedirect(event, "/");
  },
});
