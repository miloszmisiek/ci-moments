import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";

function PostPage() {
    // accessing id from Router Library Route path
    const { id } = useParams();
    const [post, setPost] = useState({ results: [] });

    useEffect(() => {
        const handleMount = async () => {
            try {
                // Here we are destructing the data property returned  from the API and renaming it to post
                // allowing us to give our  variable a more meaningful name.

                // What Promise.all does is it accepts an array of  promises and gets resolved when all the promises  
                // get resolved, returning an array of data. If any of the promises in the array fail,  
                // Promise.all gets rejected with an error.
                const [{ data: post }] = await Promise.all([
                    // with Promise.all we can later fetch another API request
                    // renew of refresh token with axiosReq
                    axiosReq.get(`/posts/${id}`),
                ]);
                setPost({ results: [post] });
                console.log(post);
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
                <p>Popular profiles for mobile</p>
                {/* spreading post object from API call in useEffect and passing setPost function as a prop (for state manipulation) */}
                {/* postPage passed without a value = returned as true inside the Page component */}
                <Post {...post.results[0]} setPosts={setPost} postPage />
                <Container className={appStyles.Content}>Comments</Container>
            </Col>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                Popular profiles for desktop
            </Col>
        </Row>
    );
}

export default PostPage;