import type { Project } from '../types'

export const projects: Project[] = [
  {
    id: 'maiagent-platform',
    title: 'The MaiAgent Platform',
    description:
      'Led development of a production Generative AI platform that doubled B2B client base and grew users from 3K to 20K. Built AI agents with memory systems, tool APIs, and MCP Client integration while cutting LLM token usage by 67%+.',
    tags: ['Python', 'LlamaIndex', 'FastAPI', 'PostgreSQL', 'Milvus'],
    category: 'engineering',
    year: '2024-2025',
    metrics: '567% user growth / 120% partner growth / 67% token reduction',
    featured: true,
  },
  {
    id: 'agentic-hybrid-rag',
    title: 'Agentic Hybrid RAG',
    description:
      'Implemented a query classification agentic AI system combining Graph RAG (Neo4j) and Vector RAG (Milvus) with intelligent routing. Applied ML clustering (K-means, DBSCAN) to build low-cost Graph RAG, saving 35% indexing token cost.',
    tags: ['Neo4j', 'Cypher', 'Milvus', 'LangGraph', 'Python'],
    category: 'ml',
    year: '2024',
    link: '#',
    github: 'https://github.com/yarikama',
    formula: 'MAR@10 = 88.2% on multi-hop datasets',
    featured: true,
  },
  {
    id: 'advanced-rag-system',
    title: 'The Scaling RAG Engine',
    description:
      'Refactored advanced RAG system with async framework and dual-database synchronization (RDB/Vector DB), scaling from 3M to 20M+ text chunks while maintaining API response times and doubling indexing performance.',
    tags: ['Python', 'PostgreSQL', 'Milvus', 'FastAPI', 'AsyncIO'],
    category: 'engineering',
    year: '2024',
    metrics: '3M → 20M+ chunks / 2x indexing speed / maintained latency',
    featured: true,
  },
  {
    id: 'llamaindex-contributor',
    title: 'LlamaIndex Open Source',
    description:
      'Contributed 14 merged pull requests to the LlamaIndex project (15K+ stars), fixing bugs and adding features in integrations with AWS Bedrock, Claude, Elasticsearch, Cohere, OpenAI, MCP Client, and AI Agent Workflow.',
    tags: ['Python', 'LlamaIndex', 'AWS Bedrock', 'Open Source'],
    category: 'engineering',
    year: '2024-2025',
    link: 'https://github.com/run-llama/llama_index',
    github: 'https://github.com/yarikama',
    metrics: '14 merged PRs / 15K+ stars project',
  },
  {
    id: 'genai-tutoring-system',
    title: 'The Syntax Tutor',
    description:
      'Multi-agent RAG tutoring system using CrewAI for collaborative problem-solving. Compared open-source LLMs (Llama 3) and commercial LLMs (GPT-4) with interactive chain-of-thought inspection via Streamlit.',
    tags: ['LangChain', 'CrewAI', 'Streamlit', 'Chroma', 'Python'],
    category: 'ml',
    year: '2024',
    link: '#',
    metrics: 'Top 3 of 50 teams / Outstanding Award',
  },
  {
    id: 'presidential-hackathon',
    title: 'Urban Noise Oracle',
    description:
      'Presidential Hackathon winning project for urban noise detection with LLM-powered structured analysis. Transformed raw sensor data into actionable insights for city planners.',
    tags: ['Python', 'LLM', 'Data Analysis', 'IoT'],
    category: 'ml',
    year: '2024',
    metrics: 'Presidential Hackathon Winner 2024',
  },
  {
    id: 'fitness-motion-classifier',
    title: 'Motion Intelligence',
    description:
      'AI fitness motion classification using MediaPipe for skeleton extraction and ML/DL models (LSTM, Random Forest) to classify squats, bench presses, and deadlifts from video data.',
    tags: ['Keras', 'scikit-learn', 'MediaPipe', 'OpenCV', 'NumPy'],
    category: 'ml',
    year: '2024',
    formula: 'Accuracy: LSTM 80.52% / RF 88.31%',
  },
  {
    id: 'enterprise-knowledge-system',
    title: 'The Knowledge Fabric',
    description:
      'Built a semantic tagging and permission management multi-knowledge base system for B2B enterprise clients including CTBC Bank, MSI, HPE, and iGroup.',
    tags: ['Python', 'PostgreSQL', 'Elasticsearch', 'FastAPI'],
    category: 'engineering',
    year: '2024',
  },
  {
    id: 'elderly-care-map',
    title: 'The Care Compass',
    description:
      'Full-stack map-based search platform for 2,000+ long-term care institutions. Designed normalized database schema with 8 tables, integrated Google Maps API for radius-based filtering and real-time distance calculation, with automated ETL pipeline for government open data.',
    tags: ['PHP', 'MySQL', 'Google Maps API', 'Bootstrap', 'JavaScript'],
    category: 'engineering',
    year: '2023-2024',
    metrics: '2,000+ institutions / 8 normalized tables / ETL pipeline',
  },
  {
    id: 'chat-bar-game-server',
    title: 'The Socket Arena',
    description:
      'Real-time multiplayer game server built with C/C++ TCP socket programming. Features multi-threaded client handling, SHA-256 authentication, MySQL persistence, and SFML-based game engine with event-driven architecture for chat and gameplay synchronization.',
    tags: ['C/C++', 'Socket Programming', 'SFML', 'MySQL', 'SHA-256'],
    category: 'engineering',
    year: '2023-2024',
    metrics: 'Multi-threaded / Real-time sync / Leaderboard system',
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const projectCategories = [
  { id: 'all', label: 'All' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'ml', label: 'ML/AI' },
] as const
