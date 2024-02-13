import React, { useState, useEffect } from "react";
import { useParams  } from "react-router-dom";
import { PROXY_URL } from "../utils/constants"; 
import HeaderMenu from '../common/HeaderMenu';
import BlogLoop from '../common/BlogLoop';
import { MainLayout } from '../common/MainLayout';

// All blogs
export const AllBlogs = () => {
    const limit = 5;
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState(null);
    const [page, setCurrpage] = useState(1);
    const [prevpage, setPrevpage] = useState(0);
    const [nextpage, setNextpage] = useState(2);
    const [sendData, setSendData]= useState({limit, page});
    

    async function fetchResult(data) {
        let query = new URLSearchParams(data);
        try {
            const response = await fetch(`${PROXY_URL}/api/blogs/all?${query}`);
            const results = await response.json();
            if(results.status === "success") {
            setBlogs(results.result.data);
                   
            let totalPage = results.result.totalPage;
            let currPage = results.result.page;
            setCurrpage(currPage);

            let nextPage = document.getElementById("nextpage");
            let prevPage = document.getElementById("prevpage");

            if(parseInt(totalPage) === 1) {
                nextPage.style.display = "none";
                prevPage.style.display = "none";
            } else {                            
                let nextCount = parseInt(currPage) + 1;
                let prevCount = parseInt(currPage) - 1;

                setPrevpage(prevCount)
                setNextpage(nextCount)
                
                nextPage.parentElement.classList.remove('disabled');
                prevPage.parentElement.classList.remove('disabled');

                if(parseInt(currPage) >= parseInt(totalPage)) {
                    nextPage.parentElement.classList.add('disabled');
                    prevPage.parentElement.classList.remove('disabled');
                }

                if(parseInt(prevCount) <= 0) {
                    prevPage.parentElement.classList.add('disabled');
                    nextPage.parentElement.classList.remove('disabled');
                }
            }
            } else {
            setMessage([results.status,results.message]);
            }
        } catch (error) {
            setMessage(["failed",error]);
        }
    }

    useEffect(() => {
        fetchResult(sendData)
    }, [sendData]); 
  
    function pagination(evt) {
        evt.preventDefault(); 
        const currTarget = evt.currentTarget;
        const page = currTarget.getAttribute("data-page");
        setSendData({limit, page}); 
    }

    let displayMsg;
    if(message) {
        if(message[0] === "success") {
            displayMsg = <p className="msg-success">{message[1]}</p>;
        } else if(message[1] === "failed") {
            displayMsg = <p className="msg-error">{message[1]}</p>;
        }
    }

    return(
        <div className="container">
            <div className="row clearfix">
                <div className="col-lg-12">  
                    <HeaderMenu/>                  
                    <div id="main-content" className="blog-page">                    
                        <div className="row clearfix">
                            <div className="col-lg-8 col-md-8 left-box" id="blogappend"> 
                            <div className="status-message">{ displayMsg  }</div>                               
                                {
                                    blogs.map((blog) => {
                                       return <BlogLoop 
                                            key={blog._id} 
                                            blogData={blog}
                                        />
                                    })
                                }
                            </div>
                        </div>
                        <div className="row clearfix">
                            <div className="col-lg-8 col-md-8 left-box">
                                <ul className="pagination pagination-primary">
                                    <li className="page-item">                                    
                                        <a className="page-link" id="prevpage" data-page={prevpage} href="/#" onClick={pagination}>Previous</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" id="nextpage" data-page={nextpage} href="/#" onClick={pagination}>Next</a>
                                    </li>
                                </ul>                            
                            </div>
                        </div>
                        <input type="hidden" id="hiden_curr_pg" value={page}/>
                    </div>
                </div>
            </div>
        </div> 
    )
}

// Blog Detail
export const Blogdetail = () => {
    const [flag, setFlag] = useState(1);
    const {slug} = useParams();
    if(!slug) setFlag(0);

    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        blog_title: '',
        blog_content: '',
        blog_img: ''
      });

    useEffect(() => {
        try {
            fetch(`${PROXY_URL}/api/blogs/detail/${slug}`,{
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((response)=> response.json())
            .then((data) => {
                if(data.status === "success"){
                    let blogImg = "";
                    if(data.result.blog_files[0].imgurl){
                        blogImg = <img src={PROXY_URL+data.result.blog_files[0].imgurl} alt=""/>;
                    }
                    const content = data.result.blog_content;
                    let contentHTML;
                    contentHTML = content.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>);
                    setFormData({
                        blog_title: data.result.blog_title,
                        blog_content: contentHTML,
                        blog_img : blogImg
                    });
                } else if(data.status === "failed"){
                    setMessage(<p className="msg-error">{data.message}</p>);
                    setFlag(0)
                }
            });
        } catch(error) {
            setMessage(<p className="msg-error">{error}</p>);
            setFlag(0)
        }
    }, [slug]); 

    let content='';
    if(flag){
        content = (
            <div className="col-lg-12 col-md-12 left-box" id="blogappend">
                <div className="blogdetail-img">
                {formData.blog_img}
                </div>
                <h1>{formData.blog_title}</h1>
                <div className="blog-desc">
                    {formData.blog_content}
                </div>
            </div>
        )
    }

    return (
        <>
        <MainLayout>
            <div className="status-message">{message}</div>                    
            <div className="blog-outer">
                {content}
            </div>
        </MainLayout>  
        </>
    )    
}
