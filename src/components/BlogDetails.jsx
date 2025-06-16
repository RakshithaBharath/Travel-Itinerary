import React from "react";
import { useParams, Link } from "react-router-dom";
import { blogs } from "../components/blogData";

const BlogDetails = () => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id);

  if (!blog)
    return <div className="text-center py-10 text-xl">Blog not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <img
        src={blog.image}
        alt={blog.title}
        className="rounded-2xl w-full h-80 object-cover mb-8"
      />
      <h1 className="text-4xl font-bold mb-2">{blog.title}</h1>
      <p className="text-gray-500 text-sm mb-6">
        {blog.date} · {blog.destination} · {blog.duration}
      </p>
      <p className="text-lg whitespace-pre-line leading-relaxed">
        {blog.description}
      </p>
      <Link
        to="/blog"
        className="block mt-6 text-blue-600 font-medium hover:underline"
      >
        ← Back to Blog List
      </Link>
    </div>
  );
};

export default BlogDetails;
