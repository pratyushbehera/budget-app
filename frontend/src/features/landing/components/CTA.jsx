import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="bg-primary-600 text-white py-24 text-center">
      <h2 className="text-4xl font-bold mb-10">
        Start managing money better today
      </h2>
      <Link
        to="/signup"
        className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold"
      >
        Create Free Account
      </Link>
    </section>
  );
}
