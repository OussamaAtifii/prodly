export function getAvatarText(email: string | undefined) {
  return email?.slice(0, 2);
}

export function formatUsername(username: string | undefined) {
  if (!username) return '';

  return (
    username?.slice(0, 1).toUpperCase() +
    username?.slice(1, username.length).toLowerCase()
  );
}
