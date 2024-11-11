import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText } from 'lucide-react';
import type React from 'react';
import { LinkComponent } from '@/components/ui/link-component';

interface GradientCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}

export function CardDashboard(
  { icon: Icon, title, description, link }: GradientCardProps = {
    icon: FileText,
    title: 'Sample Title',
    description: 'This is a sample description for the gradient card.',
    link: '#',
  },
) {
  return (
    <LinkComponent href={link}>
      <Card className='relative w-full overflow-hidden transition-all duration-300 hover:shadow-lg'>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 opacity-30" />
        <CardHeader className="relative">
          <div className='absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 p-1 text-white shadow-md'>
            <Icon className="size-5" />
          </div>
          <CardTitle className='font-bold text-gray-800 text-xl'>
            {title}
          </CardTitle>
          {/* <CardDescription className="text-sm text-gray-600">{description}</CardDescription> */}
        </CardHeader>

        {/* <CardFooter className="relative">
        <Button variant="ghost" className="group text-gray-700 hover:text-gray-900">
          Learn More
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter> */}
      </Card>
    </LinkComponent>
  );
}
