import { useEffect, useState } from "react";
import { apiClient } from "../clients/api";
import { useParams ,useNavigate } from "react-router-dom";
import type { Project } from "../types";
import TaskList from "../components/TaskList"

function ProjectDetailsPage() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [editedDescription, setEditedDescription] = useState("")
  
  const [deleteLoading, setDeleteLoading] = useState(false)

  const navigate = useNavigate()
  const { projectId } = useParams();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/projects/${projectId}`);
        console.log(res.data);
        setProject(res.data);
        setEditedName(res.data.name)
        setEditedDescription(res.data.description)
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error:any) {
        console.log(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);


  // useEffect(() => {
  //   // const fetchProjectTasks = async () => {
  //   //     try {
  //   //         const tasks = await apiClient.get(`/api/projects/${projectId}/tasks`);
  //   //         // state
  //   //         // loading error
  //   //     } catch (error) {
  //   //         console.error(error);
            
  //   //     }
  //   // }
  //   // fetchProjectTasks()
  // }, [projectId]);


// Opens edit mode
const handleEdit = () => {
  setIsEditing(true)
}
// Cancel editing and revert changes
// Closes edit mode without saving
const handleCancelEdit = () =>{
  setIsEditing(false)
  setEditedName(project?.name || "") //reset to original name
  setEditedDescription(project?.description || "")
}


// Edit handler (PUT request/save the edited name)
const handleSaveEdit = async () =>{
  try{
    setLoading(true)
const res = await apiClient.put(`/api/projects/${projectId}`,{
  name:editedName, description:editedDescription })
  // get project by id
  setProject(res.data)
  setIsEditing(false)
  setError("")
}catch(error){
  console.error(error)
  setError("Failed to update project")
}finally{
  setLoading(false)
}
}

// Delete the project by id(Delete request)
const handleDelete = async () => {
  try{
    setLoading(true)
await apiClient.delete(`/api/projects/${projectId}`)
navigate("/projects") //redirect after deletion
}catch(error)
{
  console.error(error)
  setError("Failed to delete project")
  setDeleteLoading(false)
}}
  if (loading && !project) return <div className="text-3xl text-white">Loading...</div>;

  if (error && !project) return <div className="text-3xl text-white">Error loading Project</div>;

  return (
    <div className="text-white">
      <h1 className="text-4xl">Project Details</h1>

      <div className="mt-10">
        <div className="text-3xl">{project?.name}</div>
        <div className="text-xl">{project?.description}</div>
      </div>


      {isEditing ? (
        <div className="mt-6">
          <label htmlFor="project-description">Edit Project Name</label>
          <input
            id="project-name"
            className="text-white border-2 border-white p-2 rounded w-full mb-3"
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Project name"
          />


<label htmlFor="project-description">Edit Project Description</label>
        <input
          id="project-description"
          className="text-white border-2 border-white p-2 rounded w-full mb-3"
          type="text"
          // name="project-description"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          placeholder="Project description"
        />

          <div className="flex gap-3">
            <button
              className="bg-green-600 px-6 py-2 rounded"
              onClick={handleSaveEdit}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              className="bg-gray-600 px-6 py-2 rounded"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex gap-3">
          <button
            className="bg-blue-600 px-6 py-2 rounded"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="bg-red-600 px-6 py-2 rounded"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}

      {/* useParams() returns projectId as string | undefined, but TaskList expects projectId: string. The && operator ensures TaskList only renders when projectId exists. */}
      {projectId && <TaskList projectId={projectId} />}
    </div>
  );
}

export default ProjectDetailsPage;