import React from "react";
import { Link } from "react-router-dom";
import { NotFound } from "../assets/NotFound";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Illustration */}
        <div className="flex items-center justify-center">
          {/* Put your downloaded unDraw SVG into public/undraw-404.svg */}
          <NotFound />
          {/* <img
            src="/undraw-404.svg"
            alt="404 illustration"
            className="w-full max-w-md"
            loading="lazy"
          /> */}
        </div>

        {/* Content */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Page not found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            We can’t find the page you’re looking for. It might have been moved
            or deleted.
          </p>

          <div className="flex justify-center md:justify-start gap-3">
            <Link
              to="/dashboard"
              className="inline-flex btn-primary items-center px-5 py-3 font-medium rounded-lg shadow"
            >
              Go to Dashboard
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-400">
            If you think this is an error, contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
