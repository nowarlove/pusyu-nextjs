import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Github, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  featured: boolean;
}

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Projects</h2>
          <p className="text-xl text-gray-600">Some of my recent work</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:scale-105 transition-transform">
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={project.image || '/placeholder-project.jpg'}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <div className="mb-3">
                <Badge variant="primary">{project.category}</Badge>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {project.title}
              </h3>
              
              <p className="text-gray-700 mb-4 text-sm">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                {project.githubUrl && (
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Github size={16} />
                    Code
                  </Button>
                )}
                {project.liveUrl && (
                  <Button variant="primary" size="sm" className="flex-1 gap-2">
                    <ExternalLink size={16} />
                    Live
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};