import ProjectForm from "@/components/dashboard/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-8">New Project</h1>
      <ProjectForm />
    </div>
  );
}
