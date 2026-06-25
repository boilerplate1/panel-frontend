const USERNAME_PATTERN = /^[A-Za-z0-9]{3,32}$/;

export function isValidUsername(value: string) {
  return USERNAME_PATTERN.test(value);
}
