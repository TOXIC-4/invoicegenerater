export default function SignOut() {
  window.sessionStorage.clear();
  window.location.href = "/";
}
