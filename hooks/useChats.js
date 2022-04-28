import React from "react";
import getUserChats from "../utils/getUserChats";

function useChats() {
  const [chats, setChats] = React.useState([]);
  React.useEffect(() => {
    getUserChats("UVhaUSVLWhfi7fO9spnyYfjEnMO2", "PLobKTzZtde6b6SyQlp2bZd51Su1")
      .then((data) => {
        console.log(data);
        setChats(data);
      })
      .catch((e) => console.log(e));
  }, []);
  return chats;
}

export default useChats;
