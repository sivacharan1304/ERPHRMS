        import DocViewer, { DocViewerRenderers} from "@cyntler/react-doc-viewer"
        import pdf from './test.pdf'
               import React, { useEffect, useState } from 'react';
import { useFetcher } from "react-router-dom";
import axios from "axios";
import { get, post, put,getBlob,downloadfile } from "../Service/Services";

               export default function PdfViewer() {
             
                 const [val,setval]= useState('');
               
                 const [docs,setdocs]= useState([]);


               useEffect (()=>{
                downloadfile('http://192.168.29.178/EmpDocument/DownloadFile/DownloadFile?NameFile=test.pdf')
                .then((result)=>{
                  setval(result);
                  console.log(result);
                  
                  const blob = new Blob([val], { type: "application/pdf" });
                   window.open(URL.createObjectURL(blob));
                 
                    setdocs([ { uri: window.URL.createObjectURL(blob),
                      fileName: 'test.pdf' }])
                          
                        
                        
                })
                
               },[])

            

                 return (
                   <>
              

               {/* <div  style={{height:100,backgroundColor:"grey",color:'black'}}>{blob}</div>  */}

        <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} /> 
             <embed src={docs} type="application/pdf" /> 
                    
                 </>
                 )
               }
               
               
               
               
               