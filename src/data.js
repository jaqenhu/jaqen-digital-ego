export const profile = {
  name: 'Jaqen Hu',
  alias: 'Chaojie Hu',
  handle: '@jaqenhu',
  role: 'AI Engineer / Unity VR Designer',
  tagline: 'integrating and shipping frontier technology',
  location: 'Hangzhou, China',
  email: 'jaqenhu@foxmail.com',
  phone: '+86 184-5712-6326',
  github: 'https://github.com/jaqenhu',
  linkedin: 'https://linkedin.com/in/jaqen-hu',
  intro: [
    'I work deep in AI, LLM and VR, focused on integrating frontier technology and bringing it into production. Right now I am building AI Agents — exploring agent self-iteration, digital-twin scene optimization and the limits of VR interaction systems.',
    'I believe great technical products are born where academic exploration meets engineering practice. Whether it is open-source co-creation, project collaboration or technical exchange, I am glad to take part and build together.',
  ],
}

export const stats = [
  { value: '6+', label: 'Years exploring tech' },
  { value: '12+', label: 'Projects shipped' },
  { value: '3', label: 'Core research areas' },
  { value: '∞', label: 'Curiosity for the frontier' },
]

export const projects = [
  {
    id: 'ai-workflow',
    index: '01',
    title: 'Enterprise AI Agent & Workflow Automation',
    category: 'AI Agent / Workflow',
    description:
      'A privately deployed AI platform that automates customer inquiries, ticket summarization, document processing, and reporting through agents and API integrations.',
    features:
      'Knowledge retrieval, API-triggered workflows, human approval, automated retries, and execution logs.',
    results:
      'Built 6 workflows with 15+ integrations. Achieved 92% success across 200 test runs and reduced average processing time from 15 to 3 minutes.',
    image: '/project-ai-agent-workflow.png',
    tags: ['FastGPT', 'n8n', 'LLM API', 'FastAPI', 'Docker'],
  },
  {
    id: 'rag-knowledge-base',
    index: '02',
    title: 'Enterprise RAG Knowledge Base',
    category: 'RAG / Knowledge Base',
    description:
      'A RAGFlow-based system that transforms enterprise documents into searchable, source-linked answers.',
    features:
      'Document parsing, configurable chunking, semantic retrieval, reranking, and source citations.',
    results:
      'Processed 300+ documents into 20,000+ chunks. Achieved 84% Top-3 retrieval accuracy and 88% valid-answer accuracy on a 100-question test set.',
    image: '/project-rag-knowledge-base.png',
    tags: ['RAGFlow', 'Embedding', 'Reranker', 'LLM API', 'Docker'],
  },
  {
    id: 'vr',
    index: '03',
    title: 'NPP Digital Twin & VR Training System',
    category: 'Digital Twin / VR Training',
    description:
      'A full-scale digital twin of key nuclear power plant areas for safe, repeatable VR training.',
    features:
      'Equipment interaction, guided procedures, inspection exercises, emergency simulations, and performance tracking.',
    results:
      'Delivered 10 scenarios across 3 plant areas with 60+ interactive equipment points. Reduced training costs by 40% and training time by 35%.',
    image: '/project-npp-vr-digital-twin.png',
    tags: ['Unreal Engine 5', 'BIM', 'Plant Simulation', 'OpenXR', 'C++'],
  },
]

export const skills = [
  {
    name: 'Python & API Development',
    value: 90,
    description: 'Python, FastAPI, API development, and business logic implementation.',
  },
  {
    name: 'AI Agent Development',
    value: 95,
    description: 'Agent development, tool integration, and task execution with FastGPT and LangChain.',
  },
  {
    name: 'RAG & Knowledge Retrieval',
    value: 95,
    description: 'Document parsing, chunking, embeddings, semantic retrieval, reranking, and source citations.',
  },
  {
    name: 'Workflow Automation',
    value: 95,
    description: 'n8n workflows, API triggers, human approval, and multi-step business process orchestration.',
  },
  {
    name: 'LLM Integration & Prompt Engineering',
    value: 95,
    description: 'Model API integration, prompt design, and connecting models with business applications.',
  },
  {
    name: 'Evaluation & Reliability',
    value: 90,
    description: 'Test-set evaluation, retrieval and answer quality assessment, failure analysis, automated retries, and execution logs.',
  },
  {
    name: 'Deployment & System Integration',
    value: 85,
    description: 'Docker-based private deployment and integration of models, tools, data, and business systems.',
  },
  {
    name: 'Solution Discovery & Delivery',
    value: 85,
    description: 'Requirements discovery, technical scoping, solution design, and user handoff.',
  },
]

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]
