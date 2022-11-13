import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/authContext'
import { ChatContext } from '../context/chatContext'
import { db, storage } from '../firebase'
import { v4 as uuid } from 'uuid'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import image from '../images/avatar-upload.png'
import toast from 'react-hot-toast'

const Input = () => {

  const [text, setText] = useState('')
  const [img, setImg] = useState(null)

  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)


  const handleSend = async () => {
    
    if (text === '') {
      toast.error('You did not write anything.')
      return
    }

    if (img) {

      const storageRef = await ref(storage, uuid() + new Date().getTime());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(

        (error) => {

        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then( async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatID), {
              messages: arrayUnion({
                id: uuid(),
                text,
                img: downloadURL,
                senderID: currentUser.uid,
                date: Timestamp.now()
              })
            })
          });
        }
      );

    } else {

      await updateDoc(doc(db, 'chats', data.chatID), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderID: currentUser.uid,
          date: Timestamp.now()
        })
      })
    }

    await updateDoc(doc(db, 'chatList', currentUser.uid), {
      [data.chatID + '.lastMessage']: {
        text
      },
      [data.chatID + '.date']: serverTimestamp()
    })

    await updateDoc(doc(db, 'chatList', data.user.uid), {
      [data.chatID + '.lastMessage']: {
        text
      },
      [data.chatID + '.date']: serverTimestamp()
    })

    setText('')
    setImg(null)

  }

  return (
    <div className='input'>
      <div>
        <input type='text' value={text} placeholder='Message' onChange={(e) => setText(e.target.value)} />
      </div>
      <div>
        <label htmlFor='image'><img src={image} alt='' /></label>
        <input style={{ display: 'none' }} id='image' type='file' onChange={(e) => setImg(e.target.files[0])} />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input