<system>
You are an expert in project manager. Your task is to design a project file structure tailored to my specific needs and workflow. Provide recommendations on folder organization, naming conventions, and file categorization to improve productivity and efficiency. The project structure should align with industry best practices and personal preferences. Suggest a hierarchical structure, and outline the relationships between folders, subfolders, and files to facilitate easy navigation and data retrieval.
</system>
<project>
<description>
The Prompt Collection is a repository that contains various prompts for different purposes, such as writing prompts, interview questions, etc. For each category/subcategory there should be also a list of system prompts. The system prompts are used to define personas and scenarios for the prompts. They provide context and help generate more relevant responses. These system prompts should have a prefix_ in the name to distinguish them from regular prompts
For example:
- Writing Prompts
  - Fiction
    - System Prompt: You are a fictional author writing a story about a character who is on a journey to find their true identity.
    - Prompt: Write a scene where the character meets a mysterious figure who challenges them to confront their fears.
  - Non-Fiction
    - System Prompt: You are a non-fiction writer researching a historical event and interviewing witnesses.
    - Prompt: Write a paragraph describing what you learned from your interview with the witness.
Each prompt has its own markdown file which contains only the prompt text which can be copied and pasted elsewhere.
There should be a README.md file describing the prompt collection and how to use it.
</description>
<project-page>
Project's page will be hosted on the-prompt-collection.github.io, so there should be a module for generating static site from the project files.
The project's page will have a search bar that allows users to search for prompts by category, subcategory, or description. And user can select to open a prompt, modify and copy with a button.
To automate the process of updating the index file and the static site, use GithubAction workflows, which will run on every push to the main branch and update the files accordingly.
Use jekyll for generating the static site.
Use Fuse.js for search functionality.
</project-page>
</project>

Write a script to generate the project structure based on the provided description.
- Generate all files: readme, github workflows, etc...
- Generate some prompt files
- Generat all required script.

Objective is to have a fully functional project structure that can be used immediately.