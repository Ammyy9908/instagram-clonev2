import { getAuth, updatePassword } from "firebase/auth";
const auth = getAuth();
async function changePassword(user, password) {
  try {
    await updatePassword(user, password);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export default changePassword;
