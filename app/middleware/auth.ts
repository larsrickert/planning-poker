export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useUserSession();
  if (!loggedIn.value) {
    return navigateTo(`/auth/github?redirectTo=${encodeURIComponent(to.fullPath)}`, {
      external: true,
    });
  }
});
