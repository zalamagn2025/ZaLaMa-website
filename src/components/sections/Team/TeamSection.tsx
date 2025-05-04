import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Twitter, Mail } from 'lucide-react';
import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "John Doe",
    role: "CEO & Founder",
    image: "/images/teamimg.png",
    bio: "Plus de 15 ans d'expérience dans la technologie financière et l'innovation digitale.",
    social: {
      linkedin: "https://linkedin.com/in/johndoe",
      twitter: "https://twitter.com/johndoe",
      email: "john@zalama.com"
    }
  },
  {
    name: "Jane Smith",
    role: "CTO",
    image: "/images/teamimg.png",
    bio: "Experte en développement de solutions FinTech et en architecture de systèmes sécurisés.",
    social: {
      linkedin: "https://linkedin.com/in/janesmith",
      email: "jane@zalama.com"
    }
  },
  {
    name: "Marc Johnson",
    role: "Directeur Commercial",
    image: "/images/teamimg.png",
    bio: "Spécialiste en développement commercial et partenariats stratégiques.",
    social: {
      linkedin: "https://linkedin.com/in/marcjohnson",
      twitter: "https://twitter.com/marcjohnson",
      email: "marc@zalama.com"
    }
  },
  {
    name: "Sarah Brown",
    role: "Responsable Marketing",
    image: "/team/sarah-brown.jpg",
    bio: "Passionnée par le marketing digital et l'expérience utilisateur.",
    social: {
      linkedin: "https://linkedin.com/in/sarahbrown",
      twitter: "https://twitter.com/sarahbrown",
      email: "sarah@zalama.com"
    }
  }
];

export default function TeamSection() {
  return (
    <section className="py-16 bg-gradient-to-b form-white to-[#D2DCFF] overflow-x-clip">
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-center items-center mb-12">
          <h2 className="section-title text-center">Notre Équipe</h2>
          <div className="mt-2 flex justify-center items-center">
            <span className="inline-block w-40 h-1 bg-[#10059F] rounded-full"></span>
            <span className="inline-block w-3 h-1 ml-1 bg-[#10059F] rounded-full"></span>
            <span className="inline-block w-1 h-1 ml-1 bg-[#10059F] rounded-full"></span>
          </div>
          <p className="mt-4 text-center text-gray-600 max-w-2xl">
            Une équipe passionnée et expérimentée, dédiée à révolutionner les services financiers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={200}
                    height={200}
                    className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-[#10059F] font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {member.bio}
                  </p>
                  
                  <div className="flex space-x-4">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#10059F] transition-colors duration-200"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#10059F] transition-colors duration-200"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.email && (
                      <a
                        href={`mailto:${member.social.email}`}
                        className="text-gray-600 hover:text-[#10059F] transition-colors duration-200"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}