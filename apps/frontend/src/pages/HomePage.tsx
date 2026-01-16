import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { data: projects, isLoading, error } = useProjects();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-center mt-10">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-center mt-10 text-red-500">
          Error loading projects. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Portfolio</h1>
        {user && (
          <Link
            to="/admin"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Admin Panel
          </Link>
        )}
        {!user && (
          <Link
            to="/login"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Login
          </Link>
        )}
      </div>

      {projects && projects.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No projects to display yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline inline-block"
                >
                  View Project →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
