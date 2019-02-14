import firebase from './firebase';

export function redirectOnUnauthorized(location) {
  if (!firebase.getCurrentUser()) {
    return `/?redirect=${encodeURI(location)}`;
  }
  return null;
}
