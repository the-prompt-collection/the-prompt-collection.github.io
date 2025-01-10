const fs = require('fs');
const path = require('path');

const promptsDir = path.join(__dirname, '../prompts');
const outputFilePath = path.join(__dirname, '../website/src/prompts/prompts.json');
const systemPromptPrefix = 'system_';

function generatePromptData() {
  const allPrompts = [];

  function walkSync(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkSync(filePath);
      } else if (path.extname(file) === '.md') {
        const content = fs.readFileSync(filePath, 'utf8').trim();
        const relativePath = path.relative(promptsDir, filePath);
        const pathParts = relativePath.split(path.sep);

        // Extract category and subcategories
        const category = pathParts[0];
        const subcategories = pathParts.slice(1, -1); // Exclude the file name

        // Check if it's a system prompt
        const isSystemPrompt = file.startsWith(systemPromptPrefix);

        // Generate tags
        const tags = [];
        if (isSystemPrompt) {
          tags.push('system'); // Add 'system' tag only if it's a system prompt
        }
        tags.push(category); // Add category as a tag
        tags.push(...subcategories); // Add all subcategories as tags

        // Now `tags` will contain:
        // - 'system' (if it's a system prompt)
        // - The category
        // - All subcategories (excluding the file name)

        allPrompts.push({
          id: relativePath.replace(/\//g, '-').replace(/\.md$/, ''), // Unique ID
          category,
          subcategories,
          content,
          isSystemPrompt,
          filename: file,
          tags, // Add tags field
        });
      }
    });
  }

  walkSync(promptsDir);

  fs.writeFileSync(outputFilePath, JSON.stringify(allPrompts, null, 2));
  console.log('Prompt data generated successfully!');
}

generatePromptData();