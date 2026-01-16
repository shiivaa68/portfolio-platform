import { useState } from "react";
import {
  useProjects,
  useCreateProject,
  useDeleteProject,
} from "../hooks/useProjects";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const AdminPage = () => {
  const { data: projects, isLoading, error } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");

  const handleCreate = () => {
    if (!title || !description) {
      alert("Title and description are required");
      return;
    }

    createProject.mutate(
      {
        title,
        description,
        imageUrl: imageUrl || undefined,
        link: link || undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setImageUrl("");
          setLink("");
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message?: string }>;
          alert(
            (axiosError.response?.data?.message as string) || "Failed to create project"
          );
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject.mutate(id, {
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message?: string }>;
          alert(
            (axiosError.response?.data?.message as string) || "Failed to delete project"
          );
        },
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-center">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-500 text-center">
          Error loading projects. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Create Project */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
        <div className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Project Link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <button
            onClick={handleCreate}
            disabled={createProject.isPending}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {createProject.isPending ? "Adding..." : "Add Project"}
          </button>
        </div>
      </div>

      {/* Project List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        {projects && projects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No projects yet</p>
        ) : (
          <ul className="space-y-2">
            {projects?.map((project) => (
              <li
                key={project.id}
                className="flex justify-between items-center border-b py-3"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deleteProject.isPending}
                  className="text-red-500 hover:underline ml-4 disabled:opacity-50"
                >
                  {deleteProject.isPending ? "Deleting..." : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

