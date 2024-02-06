import React, {useRef, useState } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "./App.css"
import { useAuthState} from 'react-firebase-hooks/auth';
import { useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBshRoYFH_aedSPXpcHw99meE1t2emVpIk",
  authDomain: "superchat-2cbed.firebaseapp.com",
  projectId: "superchat-2cbed",
  storageBucket: "superchat-2cbed.appspot.com",
  messagingSenderId: "424674913240",
  appId: "1:424674913240:web:0ecb17de5ff7ca5abe20ad",
  measurementId: "G-90BBZ3SM4P"
})
const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
      <SignOut />
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
      
    </div>
  );
}
function SignIn(){
   const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
   }
  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button onClick={()=> auth.signOut()}>SignOut</button>
  )
}
function ChatRoom(){

const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField:'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e)=>{
    e.preventDefault();

     const { uid, photoURL } = auth.currentUser;
     await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
     });
     setFormValue('');

     dummy.current.scrollIntoView({behavior:'smooth'});
  }
  return(
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref={dummy}> </div>
    </div>

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button type="submit">Submit</button>
    </form>
    </>
  )
}
function ChatMessage(props){
  const {text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className ={`message ${messageClass}` }>
      <img src={photoURL} />
      <p>{text}</p>
      </div>
  )
}

export default App;
