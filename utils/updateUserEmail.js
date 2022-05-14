import { updateEmail } from "firebase/auth";

const updateUserEmail = async (user, new_mail) => {
  try {
    await updateEmail(user, new_mail);
    return true;
  } catch (e) {
    if (e) {
      return false;
    }
  }
};

export default updateUserEmail;
