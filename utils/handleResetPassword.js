import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  getAuth,
} from "firebase/auth";

const auth = getAuth();
async function handlePasswordReset(actionCode, continueUrl, lang, apiKey) {
  console.log(actionCode, continueUrl, lang, apiKey);
  try {
    const email = await verifyPasswordResetCode(auth, actionCode);
    return email;
  } catch (e) {
    return false;
  }
}

export default handlePasswordReset;
