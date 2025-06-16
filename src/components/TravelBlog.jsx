import React from "react";
import { Link } from "react-router-dom";
import { blogs } from "../components/blogData";

const TravelBlog = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-center mb-14">
        Travel Itinerary Blog
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="h-56 w-full object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-500 text-sm mb-2">
                {blog.date} · {blog.destination} · {blog.duration}
              </p>
              <p className="text-gray-700 text-base mb-4 whitespace-pre-line">
                {blog.description.trim().slice(0, 120)}...
              </p>
              <Link
                to={`/blog/${blog.id}`}
                className="text-blue-600 font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelBlog;
