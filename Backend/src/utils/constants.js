// src/utils/constants.js

// Folders we want to skip during ingestion [cite: 119]
export const IGNORED_FOLDERS = [
  'node_modules', 
  '.git', 
  'dist', 
  'build', 
  'coverage', 
  '.vscode', 
  '.idea'
];

// Allowed extensions to ensure we only read source code [cite: 119]
export const ALLOWED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', 
  '.py', '.java', '.go', '.rb', 
  '.php', '.cs', '.html', '.css', 
  '.json', '.md', '.yml', '.yaml'
];

// Basic signatures to detect the tech stack from filenames [cite: 119]
export const TECH_PATTERNS = {
  'Node.js': ['package.json'],
  'React': ['package.json'], // Enhanced detection via package.json content in techDetector
  'Python': ['requirements.txt', 'Pipfile', 'setup.py'],
  'Java': ['pom.xml', 'build.gradle'],
  'Go': ['go.mod'],
  'Docker': ['Dockerfile', 'docker-compose.yml']
};