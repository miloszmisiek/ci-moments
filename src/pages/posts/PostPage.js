import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";

import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Comment from "../comments/Comment";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import Asset from "../../components/Asset";
import PopularProfiles from "../profiles/PopularProfiles";

function PostPage() {
    // accessing id from Router Library Route path
    const { id } = useParams();
    const [post, setPost] = useState({ results: [] });

    const currentUser = useCurrentUser();
    const profile_image = currentUser?.profile_image;
    const [comments, setComments] = useState({ results: [] });

    useEffect(() => {
        const handleMount = async () => {
            try {
                // Here we are destructing the data property returned  from the API and renaming it to post
                // allowing us to give our  variable a more meaningful name.

                // What Promise.all does is it accepts an array of  promises and gets resolved when all the promises  
                // get resolved, returning an array of data. If any of the promises in the array fail,  
                // Promise.all gets rejected with an error.
                const [{ data: post }, { data: comments }] = await Promise.all([
                    // with Promise.all we can later fetch another API request
                    // renew of refresh token with axiosReq
                    axiosReq.get(`/posts/${id}`),
                    axiosReq.get(`/comments/?post=${id}`)
                ]);
                setPost({ results: [post] });
                setComments(comments);
            } catch (err) {
                console.log(err);
            }
        };

        // run function every time the id in the url changes
        handleMount();
    }, [id]);

    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <PopularProfiles mobile />
                {/* spreading post object from API call in useEffect and passing setPost function as a prop (for state manipulation) */}
                {/* postPage passed without a value = returned as true inside the Page component */}
                <Post {...post.results[0]} setPosts={setPost} postPage />
                <Container className={appStyles.Content}>
                    {currentUser ? (
                        <CommentCreateForm
                            profile_id={currentUser.profile_id}
                            profileImage={profile_image}
                            post={id}
                            setPost={setPost}
                            setComments={setComments}
                        />
                    ) : comments.results.length ? (
                        "Comments"
                    ) : null}
                    {comments.results.length ? (
                        <InfiniteScroll
                            //   what to load as a children prop - our map function for dispalying the posts 
                            children={comments.results.map((comment) => (
                                <Comment setPost={setPost} setComments={setComments} key={comment.id} {...comment} />
                            ))}
                            // how many values are being displayed at the moment (from API setup)
                            dataLength={comments.results.length}
                            // what to display on loading
                            loader={<Asset spinner />}
                            // BANG! BANG! returning boolean value for any truthy operators, our API at the end return value of null
                            hasMore={!!comments.next}
                            // importing fetchmoredata componenet for what is next to be dispalayed, dispalyed only if hasMore is true
                            next={() => fetchMoreData(comments, setComments)}
                        />
                    ) : currentUser ? (
                        <span>No comments yet, be the first to comment!</span>
                    ) : (
                        <span>No comments... yet</span>
                    )}
                </Container>
            </Col>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                <PopularProfiles />
            </Col>
        </Row>
    );
}

export default PostPage;