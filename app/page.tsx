"use client"

import {Camera} from "react-camera-pro";
import { JSX, useEffect, useRef, useState } from "react";
import ReactToPrint from 'react-to-print';



export default function Home() {
  const camera = useRef(null)
  const [image, setImage] = useState<any>([]);
  const [imageElm, setImageElm] = useState<JSX.Element[]>([])
  const [countdown, setCountDown] = useState(-1)

  const handlePrint = () => {
    if (imageElm.length<3) return

    const originalContents = document.body.innerHTML;
    let elm = ""
    for (let i=0;i<image.length;i++) {
      elm += `<img src=${image[i]} alt="" style="height: auto; width: 400px"/>`
    }
    document.body.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; gap: 20px">${elm}</div>`
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  useEffect(() => {
    if (countdown == 0) {
      const photo = camera.current.takePhoto();
                if (imageElm.length<3) {
                  setImageElm(prevItems => [...prevItems, <img src={photo} style={{width: "200px", height:"auto"}}/>])
                  setImage(prevItems => [...prevItems, photo])
                } else {
                  setImageElm([imageElm[0],imageElm[1],<img src={photo} style={{width: "200px", height:"auto"}}/>])
                  setImage([image[0],image[1],photo])
                }
                
      setCountDown(-1)
      return;
    }

    const interval = setInterval(() => {
      if (countdown>0) {
        setCountDown(prev => prev - 1)
      }
      
    }, 1000);

    return () => clearInterval(interval)
  }, [countdown]);
  
  return (
    <div>
      <div style={{marginInline: "auto", width: "800px", height: "auto"}}>
        <Camera ref={camera} errorMessages={{
          noCameraAccessible: 'No camera found',
          permissionDenied: 'Camera access was denied',
          switchCamera: 'Unable to switch camera',
          canvas: 'Canvas error',
        }} aspectRatio={4/3}/>
      </div>
      <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
        <div style={{display: "flex", alignItems: "center"}}>
          <button
            onClick={() => {
              setCountDown(3)
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            }}
            style={{width: "150px", height: "40px", margin: "20px"}}
          >{image.length==3 ? "Retry" : "Take Photo"}</button>
          <button style={{width: "150px", height: "40px", margin: "20px"}} onClick={handlePrint}>Print</button>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "20px"}}>
            {imageElm}
        </div>
      </div>
      {countdown>0 ? 
      <div style={{position: "fixed", background: "rgba(0,0,0,0.5)", width: "100%", height: "100%", top: "0", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "200px"}}>
        {countdown}
      </div> : countdown==0 ?
        <div style={{position: "fixed", background: "white", width: "100%", height: "100%", top: "0", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "200px"}}></div>
        : <div></div>
      }
      
      
    </div>
    
  );
}
