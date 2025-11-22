import { useEffect } from "react";

import usePostWrap from "../Hooks/usePostWraps";
import {useUrlSets} from "../Hooks/useUrlSet";


const doPost = usePostWrap;

function onSignedInWrap({onSignedIn,data})
{
    

    console.log("inside onSignedInWrap",{onSignedIn,data})

   //data =  atob(data.split('.')[1])
    onSignedIn?.(data);
}
export default function GoogleSignIn({ onSignedIn }) {
  useEffect(() => {
        console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)

    const initializeGoogle = () => {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin"),
        { theme: "outline", size: "large" }
      );
    };

    if (window.google?.accounts) {
      initializeGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    }
  }, []);

  async function handleCredentialResponse(response) {
    const idToken = response.credential;
    console.log("✅ Google ID token:", idToken);
    
  //  onSignedInWrap({onSignedIn,data:idToken});

    let {urlForAPICredential} =useUrlSets();
  console.log("urlForAPICredential:", urlForAPICredential);
console.log("useUrlSets:", useUrlSets());

    // Optionally send it to your backend for verification
    try {

     const res = await   doPost(urlForAPICredential,{ id_token: idToken })

      const data = await res.json();
      if (res.ok) {
        console.log("User logged in:", data);
    onSignedInWrap({onSignedIn,data});
        
      } else {
        console.error("Login failed:", data);
      }
    } catch (err) {
      console.error("Network or server error:", err);
    }
  }

  return <div id="google-signin"></div>;
}