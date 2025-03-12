export default defineOAuthGoogleEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    const { email, name, picture: avatar } = user;
    try {
      const registeredUser = await createOrGetUser({
        name,
        email,
        avatar,
        provider: "google",
        email_verified: true,
      });
      await setUserSession(event, { user: registeredUser });
      return sendRedirect(event, "/");
    } catch (error) {
      console.error(error);
    }
  },
});
