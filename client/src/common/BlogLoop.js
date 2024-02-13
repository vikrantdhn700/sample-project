import {SITE_URL, PROXY_URL} from "../utils/constants";
const BlogLoop = (props) => {
    const {blog_title, blog_content, blog_slug, createdAt} = props.blogData;

    let imgURL = `${SITE_URL}/img/noimg-blog.png`;
    if(props.blogData.blog_files[0].imgurl){
        imgURL = PROXY_URL+props.blogData.blog_files[0].imgurl;
    }

    const newDate = new Date(createdAt);
    const publish_date = newDate.getFullYear()+"-"+(newDate.getMonth()+1)+"-"+newDate.getDate()+" "+newDate.getHours()+":"+newDate.getMinutes() + ":" + newDate.getSeconds();

    return (
        <div className="card single_post">
            <div className="body">
                <div className="img-post">
                    <img className="d-block img-fluid" src={imgURL} alt={blog_title}/>
                </div>
                <h3><a href={`${SITE_URL}/blogs/${blog_slug}`}>{blog_title}</a></h3>
                <p>{blog_content}</p>
            </div>
            <div className="footer">
                <div className="actions">
                    <a href={`${SITE_URL}/blogs/${blog_slug}`} className="btn btn-outline-secondary">Continue Reading</a>
                </div>
                <ul className="stats">
                    <li>{publish_date}</li>
                </ul>
            </div>
        </div>
    )
}

export default BlogLoop;