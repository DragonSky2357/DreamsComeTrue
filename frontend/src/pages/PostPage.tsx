import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const PostPage = () => {
  const { id } = useParams();

  const [post, setPost] = useState<any>();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/post/${id}`)
      .then((response: any) => {
        console.log(response.data);
        setPost(response.data);
      });
  }, []);
  return (
    <div>
      <div>
        {post && (
          <div>
            <img src={post.imageUrl} />
            <div>
              <h1>{post.title}</h1>
              <h1>{post.bodyText}</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPage;
