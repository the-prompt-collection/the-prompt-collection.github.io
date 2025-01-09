import os
import json

def generate_prompt_index(root_dir):
    prompts_data = []
    prompts_dir = os.path.join(root_dir, "prompts")

    for category in os.listdir(prompts_dir):
        category_path = os.path.join(prompts_dir, category)
        if os.path.isdir(category_path):
            for subcategory in os.listdir(category_path):
                subcategory_path = os.path.join(category_path, subcategory)
                if os.path.isdir(subcategory_path):
                    for filename in os.listdir(subcategory_path):
                        if filename.endswith(".md"):
                            filepath = os.path.join(subcategory_path, filename)
                            with open(filepath, 'r') as f:
                                content = f.read().strip()
                            title = filename[:-3].replace('-', ' ').capitalize()
                            is_system_prompt = filename.startswith("system_")
                            prompts_data.append({
                                "category": category.replace('-', ' ').capitalize(),
                                "subcategory": subcategory.replace('-', ' ').capitalize(),
                                "title": title,
                                "content": content,
                                "isSystemPrompt": is_system_prompt
                            })

    return prompts_data

if __name__ == "__main__":
    project_root = "."  # Adjust if running from elsewhere
    index_data = generate_prompt_index(project_root)
    output_path = os.path.join(project_root, "website", "_data", "prompts.json")

    with open(output_path, 'w') as outfile:
        json.dump(index_data, outfile, indent=4)

    print(f"Generated prompts index at: {output_path}")