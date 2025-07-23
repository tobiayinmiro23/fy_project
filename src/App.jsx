import { useState } from 'react'
import './App.css'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from './firebase';

function App() {
  const storage = getStorage();
  const [link, setlink] = useState('')
  const [file, setfile] = useState('')

  const upload = () => {
    console.log(file)
    const storageRef = ref(storage, `${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress)
      },
      (error) => {
        alert(error?.message || 'an error occured,try again later')
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setlink(downloadURL)
          console.log(downloadURL)
            .catch(error => {
              alert(error?.message || 'an error occured,try again later')
            })
        });
      }
    );
  }

  return (
    <>
      <h1>Image to link converter</h1>
      <div className='holder'>
        <div className={link !== '' ? "link" : undefined}>{link}</div>
        <label className='' >
          <h3>select an image</h3>
        </label>
        <div >
          <input type="file" name="upload" accept="image/*" className='upload' onInput={(e) => { setfile(e.target.files[0]) }
          } id="" />
          <button onClick={upload}>generate link</button>
        </div>
      </div>
    </>
  )
}

export default App
