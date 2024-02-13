import React, { useState, useEffect } from "react";
import { NavLink, useParams  } from "react-router-dom";
import { PROXY_URL, SITE_URL } from "../utils/constants"; 
import { MainLayout } from '../common/MainLayout';
import { getToken} from '../common/useAuth';

/**  Components **/
// Blog Loop
const BlogLoop = (props) => {
    const {_id, blog_title, createdAt} = props.blogData;
    let imgURL = `${SITE_URL}/img/noimg-blog.png`;
    if(props.blogData.blog_files[0].imgurl){
        imgURL = PROXY_URL+props.blogData.blog_files[0].imgurl;
    }
    const newDate = new Date(createdAt);
    const publish_date = newDate.getFullYear()+"-"+(newDate.getMonth()+1)+"-"+newDate.getDate()+" "+newDate.getHours()+":"+newDate.getMinutes() + ":" + newDate.getSeconds();
    let editLink = `/account/user-blogs/edit/${_id}`;
    let slno = parseInt(props.loopRep) + parseInt(props.index) + 1;
    return (
        <tr>
            <td>{slno}</td>
            <td>{blog_title}</td>
            <td>{publish_date}</td>
            <td><img src={imgURL} className="img-small" alt={blog_title}/></td>
            <td>
                <NavLink to={editLink}>Edit</NavLink> | <NavLink to={'#'} data-id={_id} onClick={props.deleteBlog}>Delete</NavLink>
            </td>
        </tr>
    )
}

/** Render Functions **/ 

// User Blog Lists
export const Userblogs = () => {
    const limit = 5;
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState(null);
    const [page, setCurrpage] = useState(1);
    const [prevpage, setPrevpage] = useState(0);
    const [nextpage, setNextpage] = useState(2);
    const [sendData, setSendData]= useState({limit, page});
    
    const totalRep = page * limit;
    const loopRep = totalRep - limit;

    async function fetchResult(data) {
        let token = getToken();
        let query = new URLSearchParams(data);
        try {
            const response = await fetch(`${PROXY_URL}/api/blogs?${query}`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
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
                setMessage(<p className="msg-error">{results.message}</p>);
            }
        } catch (error) {
            setMessage(<p className="msg-error">{error.message}</p>);
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

    async function deleteBlog(evt) {
        evt.preventDefault();
        let token = getToken();
        let currTarget = evt.currentTarget;   
        let id = currTarget.getAttribute("data-id");    
        try {
            await fetch(`${PROXY_URL}/api/blogs/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }).then((response)=> response.json())
            .then((data) => {
                if(data.status === "failed") {
                    setMessage(<p className="msg-error">{data.message}</p>);
                } else if(data.status === "success") {
                    setSendData({limit, page}); 
                    setMessage(<p className="msg-success">{data.message}.</p>);
                }
            });
        } catch (error) {
            setMessage(error);
        } 
    }

  return(
    <>
    <MainLayout>
    <div className="status-message">{message}</div>                    
    <div className="blog-outer">
    <NavLink to="/account/user-blogs/add">+ Add New Blog</NavLink>
    <table className="table table-hover table-condensed">
        <thead>
            <tr>
                <th>Slno</th>
                <th>Title</th>
                <th>Publish Date</th>
                <th>Image</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody id="blogappend">
        {
            blogs.map((blog, index) => {
                return <BlogLoop 
                    key={blog._id} 
                    blogData={blog} 
                    index={index} 
                    loopRep={loopRep}
                    deleteBlog={deleteBlog}
                />
            })
        }
        </tbody>
    </table>
    <ul className="pagination">
        <li className="page-item">
            <NavLink to="#" className="page-link" id="prevpage" data-page={prevpage} onClick={pagination}>Previous</NavLink>
        </li>
        <li className="page-item">
            <NavLink to="#" className="page-link" id="nextpage" data-page={nextpage} onClick={pagination}>Next</NavLink>
        </li>
    </ul>
    </div>
    </MainLayout>
    <input type="hidden" id="hiden_curr_pg" value={page}/> 
    </>
  )
}

// Add Blog 

export const Addblog = () => {
    const token = getToken();
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        blog_title: '',
        blog_content: '',
      });
    
      const [file, setBlogfile] = useState(null);
      const handleFileChange = (event) => {
        setBlogfile(event.target.files[0]);
      };
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      // Handle form submission
      const handleSubmit = async (e) => {
        e.preventDefault();   

        let formData2 = new FormData();
        formData2.append("blog_title",formData.blog_title);
        formData2.append("blog_content",formData.blog_content);
        formData2.append("file",file);
        try {
          await fetch(`${PROXY_URL}/api/blogs`, {
            method: 'POST',
            body : formData2,
            headers: {
                'Authorization': `Bearer ${token}`
            },
          }).then((response)=> response.json())
          .then((data) => {
            if(data.status === "failed") {
              setMessage(<p className="msg-error">{data.message}</p>);
            } else if(data.status === "success") {
              setMessage(<p className="msg-success">{data.message}</p>);
              e.target.reset();
              setFormData({ blog_title: '', blog_content: ''});
              setBlogfile(null)
            }
          });
        } catch (error) {
          setMessage(error);
        }    
      };
    return (
        <>
          <MainLayout>
          <div className="status-message">{message}</div>                    
            <div className="blog-outer">
            <div className="form-wrap">
                <h1>Add Blog</h1>
                <div id="return-msg"></div>
                <form action="" id="form-add" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="blog_title">Title:</label>
                        <input type="text" className="form-control" name="blog_title" placeholder="Enter Title" id="blog_title" value={formData.blog_title} onChange={handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="blog_content">Description:</label>
                        <textarea className="form-control" name="blog_content" placeholder="Enter Description..." id="blog_content" value={formData.blog_content} onChange={handleInputChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="file">Image:</label>
                        <input type="file" className="form-control" name="file" placeholder="Enter Title" id="file" onChange={handleFileChange}/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                </div>
            </div>
          </MainLayout>  
        </>
    )
}

// Edit Blog

export const EditBlog = () => {
    const [flag, setFlag] = useState(1);
    const {id} = useParams();
    if(!id) setFlag(0);

    const token = getToken();
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        blog_title: '',
        blog_content: '',
      });
    const [file, setBlogfile] = useState(null);
    const [displayimg, setDisplayImage] = useState(null);

    async function fetchData(id, token) {
        try {
            fetch(`${PROXY_URL}/api/blogs/${id}`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then((response)=> response.json())
            .then((data) => {
                if(data.status === "success"){
                    setFormData({
                        blog_title: data.result.blog_title,
                        blog_content: data.result.blog_content,
                    });

                    if(data.result.blog_files[0].imgurl){
                        let blog_img = PROXY_URL+data.result.blog_files[0].imgurl;
                        setDisplayImage(<div className="img-bx"><NavLink to={blog_img} target="_blank"><img src={blog_img} className="img-small" alt=""/></NavLink> | <span><NavLink to={'#'} id="removeImg" onClick={deleteImage} target="_blank">Remove</NavLink></span></div>)
                    }
                } else if(data.status === "failed"){
                    setMessage(<p className="msg-error">{data.message}</p>);
                    setFlag(0)
                }
            });
        } catch(error) {
            setMessage(<p className="msg-error">{error}</p>);
            setFlag(0)
        }
    }

    useEffect(() => {
        fetchData(id, token)
    }, [id, token]); 
    
    const handleFileChange = (event) => {
        setBlogfile(event.target.files[0]);
    };

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value,
    });
    };

    // Delete Image 
    async function deleteImage(event) {
        event.preventDefault();
        try {
            await fetch(`${PROXY_URL}/api/blogs/deletefile/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }).then((response)=> response.json())
            .then((data) => {
                if(data.status === "failed") {
                    setMessage(<p className="msg-error">{data.message}</p>);
                } else if(data.status === "success") {
                    setDisplayImage(null)
                    setMessage(<p className="msg-success">{data.message}.</p>);
                }
            });
        } catch (error) {
            setMessage(error);
        }        
    }
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();   

        let formData2 = new FormData();
        formData2.append("blog_title",formData.blog_title);
        formData2.append("blog_content",formData.blog_content);
        formData2.append("file",file);
        try {
            await fetch(`${PROXY_URL}/api/blogs/${id}`, {
            method: 'PATCH',
            body : formData2,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            }).then((response)=> response.json())
            .then((data) => {
            if(data.status === "failed") {
                setMessage(<p className="msg-error">{data.message}</p>);
            } else if(data.status === "success") {
                setMessage(<p className="msg-success">{data.message}</p>);
                setBlogfile(null)
                fetchData(id, token) 
            }
            });
        } catch (error) {
            setMessage(error);
            setFlag(0)
        }    
    };
    
    let content='';
    if(flag) {
        content = (
            <form action="" id="form-edit" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="blog_title">Title:</label>
                    <input type="text" className="form-control" name="blog_title" placeholder="Enter Title" id="blog_title" value={formData.blog_title} onChange={handleInputChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="blog_content">Description:</label>
                    <textarea className="form-control" name="blog_content" placeholder="Enter Description..." id="blog_content" value={formData.blog_content} onChange={handleInputChange}></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="file">Image:</label>
                    <input type="file" className="form-control" name="file" placeholder="Enter Title" id="file" onChange={handleFileChange}/>
                    {displayimg}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
    }

    return (
        <>
          <MainLayout>
          <div className="status-message">{message}</div>                    
            <div className="blog-outer">
            <div className="form-wrap">
                <h1>Edit Blog</h1>
                <div id="return-msg"></div>
                    {content}
                </div>
            </div>
          </MainLayout>  
        </>
    )
}