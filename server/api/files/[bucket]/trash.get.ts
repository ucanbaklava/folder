export default defineEventHandler(async (event) => {
  const user = await getVerifiedUser(event);

  //@ts-ignore
  return await getTrashed(event, user.id);
});
