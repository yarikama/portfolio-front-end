import type { TechCategory, LabNote } from '../types'

export const techStack: TechCategory[] = [
  {
    category: 'Languages',
    items: ['Python', 'C/C++', 'TypeScript', 'JavaScript'],
  },
  {
    category: 'GenAI',
    items: ['LlamaIndex', 'LangChain', 'LangGraph', 'MCP', 'CrewAI'],
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'Neo4j', 'Milvus', 'Elasticsearch', 'Chroma', 'MongoDB'],
  },
  {
    category: 'Backend',
    items: ['Django', 'FastAPI', 'Express.js', 'Nginx'],
  },
  {
    category: 'Frontend',
    items: ['React', 'HTML', 'CSS', 'JavaScript', 'Streamlit'],
  },
  {
    category: 'Data Science',
    items: ['NumPy', 'Pandas', 'scikit-learn', 'PyTorch', 'Keras'],
  },
  {
    category: 'AWS',
    items: ['Bedrock', 'EMR', 'EC2', 'S3', 'RDS', 'ElastiCache'],
  },
  {
    category: 'Tools',
    items: ['nvim', 'git', 'Docker', 'Shell Script', 'pytest'],
  },
  {
    category: 'Practices',
    items: ['Agile', 'Scrum', 'TDD', 'CI/CD', 'Code Review'],
  },
]

// Lab notes will be fetched from backend API
export const labNotes: LabNote[] = []
