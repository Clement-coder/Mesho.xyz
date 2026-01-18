import React from 'react';
import { Code, Database, Smartphone, Cloud, HeartIcon as ReactIcon, Superscript as TypeScript, Zap, PieChart, Brain, Wind, Container, ChevronRight, Heart, ShoppingCart, Settings, LogOut, BarChart3, Menu, X, MapPin, Clock, Users, Award, TrendingUp, Briefcase, BookOpen, FileText } from 'lucide-react';

type IconName =
  | 'Code'
  | 'Database'
  | 'Smartphone'
  | 'Cloud'
  | 'React'
  | 'TypeScript'
  | 'Zap'
  | 'PieChart'
  | 'Brain'
  | 'Wind'
  | 'Container'
  | 'ChevronRight'
  | 'Heart'
  | 'ShoppingCart'
  | 'Settings'
  | 'LogOut'
  | 'BarChart3'
  | 'Menu'
  | 'X'
  | 'MapPin'
  | 'Clock'
  | 'Users'
  | 'Award'
  | 'TrendingUp'
  | 'Briefcase'
  | 'BookOpen'
  | 'FileText';

const iconMap: Record<IconName, React.ReactNode> = {
  Code: <Code className="w-full h-full" />,
  Database: <Database className="w-full h-full" />,
  Smartphone: <Smartphone className="w-full h-full" />,
  Cloud: <Cloud className="w-full h-full" />,
  React: <ReactIcon className="w-full h-full" />,
  TypeScript: <TypeScript className="w-full h-full" />,
  Zap: <Zap className="w-full h-full" />,
  PieChart: <PieChart className="w-full h-full" />,
  Brain: <Brain className="w-full h-full" />,
  Wind: <Wind className="w-full h-full" />,
  Container: <Container className="w-full h-full" />,
  ChevronRight: <ChevronRight className="w-full h-full" />,
  Heart: <Heart className="w-full h-full" />,
  ShoppingCart: <ShoppingCart className="w-full h-full" />,
  Settings: <Settings className="w-full h-full" />,
  LogOut: <LogOut className="w-full h-full" />,
  BarChart3: <BarChart3 className="w-full h-full" />,
  Menu: <Menu className="w-full h-full" />,
  X: <X className="w-full h-full" />,
  MapPin: <MapPin className="w-full h-full" />,
  Clock: <Clock className="w-full h-full" />,
  Users: <Users className="w-full h-full" />,
  Award: <Award className="w-full h-full" />,
  TrendingUp: <TrendingUp className="w-full h-full" />,
  Briefcase: <Briefcase className="w-full h-full" />,
  BookOpen: <BookOpen className="w-full h-full" />,
  FileText: <FileText className="w-full h-full" />,
};

export const Icon = ({
  name,
  size = 24,
  className = '',
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      style={{ width: size, height: size, ...style }}
      className={`flex items-center justify-center ${className}`}
    >
      {iconMap[name]}
    </div>
  );
};
