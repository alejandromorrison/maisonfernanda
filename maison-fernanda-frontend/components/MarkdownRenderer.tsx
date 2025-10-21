import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    // Simple markdown renderer for basic formatting
    return text
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className="text-3xl font-playfair font-bold mb-4 text-deep-taupe">
              {line.substring(2)}
            </h1>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-playfair font-bold mb-3 text-deep-taupe mt-6">
              {line.substring(3)}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl font-playfair font-bold mb-2 text-deep-taupe mt-4">
              {line.substring(4)}
            </h3>
          );
        }
        if (line.startsWith('#### ')) {
          return (
            <h4 key={index} className="text-lg font-playfair font-bold mb-2 text-deep-taupe mt-3">
              {line.substring(5)}
            </h4>
          );
        }

        // Lists
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 mb-1 text-deep-taupe/80">
              {line.substring(2)}
            </li>
          );
        }
        if (line.startsWith('* ')) {
          return (
            <li key={index} className="ml-4 mb-1 text-deep-taupe/80">
              {line.substring(2)}
            </li>
          );
        }

        // Bold text
        if (line.includes('**')) {
          const parts = line.split('**');
          return (
            <p key={index} className="mb-3 text-deep-taupe/80">
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
              )}
            </p>
          );
        }

        // Code blocks
        if (line.startsWith('`') && line.endsWith('`')) {
          return (
            <code key={index} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
              {line.substring(1, line.length - 1)}
            </code>
          );
        }

        // Tables
        if (line.includes('|')) {
          const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
          if (cells.length > 1) {
            const isHeader = line.includes('---') || cells.some(cell => cell.includes('---'));
            if (isHeader) {
              return (
                <tr key={index} className="border-b border-warm-taupe/20">
                  {cells.map((cell, i) => (
                    <th key={i} className="text-left py-2 px-4 font-semibold text-deep-taupe">
                      {cell.replace(/-/g, '')}
                    </th>
                  ))}
                </tr>
              );
            } else {
              return (
                <tr key={index} className="border-b border-warm-taupe/10">
                  {cells.map((cell, i) => (
                    <td key={i} className="py-2 px-4 text-deep-taupe/80">
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            }
          }
        }

        // Empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }

        // Regular paragraphs
        if (line.trim()) {
          return (
            <p key={index} className="mb-3 text-deep-taupe/80 leading-relaxed">
              {line}
            </p>
          );
        }

        return null;
      })
      .filter(Boolean);
  };

  return (
    <div className="prose prose-lg max-w-none">
      {renderMarkdown(content)}
    </div>
  );
};

export default MarkdownRenderer;