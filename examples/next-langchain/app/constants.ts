import {
  Activity,
  Cloud,
  Cpu,
  Image,
  type LucideIcon,
  MessageCircle,
  Shield,
  Sparkles,
  Wand2,
  Wrench,
} from 'lucide-react';
export interface NavItem {
  badge?: string;
  description: string;
  href: string;
  icon: LucideIcon;
  label: string;
}

export const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Basic Chat',
    description: 'Simple LangChain streaming',
    icon: MessageCircle,
  },
  {
    href: '/completion',
    label: 'Text Completion',
    description: 'useCompletion streaming',
    icon: Sparkles,
  },
  {
    href: '/langgraph',
    label: 'LangGraph',
    description: 'StateGraph with streaming',
    icon: Cpu,
  },
  {
    href: '/multimodal',
    label: 'Vision Input',
    description: 'Send images for analysis',
    icon: Image,
  },
  {
    href: '/image-generation',
    label: 'Image Generation',
    description: 'Generate images as output',
    icon: Wand2,
  },
  {
    href: '/createAgent',
    label: 'ReAct Agent',
    description: 'Reasoning + multiple tools',
    icon: Wrench,
  },
  {
    href: '/hitl',
    label: 'Human-in-the-Loop',
    description: 'Tool approval workflow',
    icon: Shield,
  },
  {
    href: '/custom-data',
    label: 'Custom Data Parts',
    description: 'Typed streaming events',
    icon: Activity,
  },
  {
    href: '/langsmith',
    label: 'LangSmith Deploy',
    description: 'Browser transport',
    icon: Cloud,
  },
];
