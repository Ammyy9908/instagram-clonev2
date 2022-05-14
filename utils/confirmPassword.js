import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  getAuth,
} from "firebase/auth";

const auth = getAuth();
async function ConfirmPasswordAsync(email, new_password, actionCode) {
  try {
    const changed = await confirmPasswordReset(auth, actionCode, new_password);
    console.log(changed);
    return true;
  } catch (e) {
    return false;
  }
}

export default ConfirmPasswordAsync;
