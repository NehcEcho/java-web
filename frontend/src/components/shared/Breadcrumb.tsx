import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-[#8A8278] mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-4 h-4 text-[#8A8278]" />}
          {item.href ? (
            <Link to={item.href} className="hover:text-[#C5A54E] transition-colors">{item.label}</Link>
          ) : (
            <span className="text-[#C5A54E] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
