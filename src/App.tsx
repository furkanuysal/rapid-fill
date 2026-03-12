import { useEffect } from "react";
import { saveProfile, getProfile } from "./storage/profileStorage";

function App() {
  useEffect(() => {
    async function testStorage() {
      await saveProfile({
        firstName: "Furkan",
        lastName: "Uysal",
        email: "furkan@test.com",
        phone: "5555555",
      });

      const profile = await getProfile();

      console.log("PROFILE FROM STORAGE:", profile);
    }

    testStorage();
  }, []);

  return (
    <div>
      <h1>RapidFill</h1>
      <p>Storage test</p>
    </div>
  );
}

export default App;
