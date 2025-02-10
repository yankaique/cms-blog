"use client";

import { Link } from "@/lib/navigation";
import { getBlogPosts } from "@/server/blogService";
import { useBlogStore } from "@/stores/blogStore";
import { Post } from "@prisma/client";
import { Button, Card, List } from "antd";
import { useEffect, useState } from "react";

export const BlogHomePage = () => {
    const { blog } = useBlogStore();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleGetPosts = async () => {
            if(!blog) return
            setLoading(true)
            const posts = await getBlogPosts({blogId: blog.id})
            setLoading(false)
            const { data } = posts
            if(!data) return
            setPosts(data)
        }
        handleGetPosts()
    }, [blog])

    return (
        <div>
            <List 
                loading={loading}
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 3,
                    xl: 4,
                    xxl: 4,
                }}
                dataSource={posts}
                renderItem={(post) => (
                    <List.Item>
                        <Card title={post.title}>
                            <div>
                                {post.subtitle}
                            </div>
                            <Button type="primary" className="mt-5">
                                <Link href={`/${blog?.slug}/posts/${post.slug}`}>
                                    Leia Mais
                                </Link>
                            </Button>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};