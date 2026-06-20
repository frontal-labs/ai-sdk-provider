import type { SourceUrlUIPart } from 'ai';
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from './ai-elements/sources';

const SourcesView = ({ sources }: { sources: SourceUrlUIPart[] }) => {
  if (sources.length === 0) {
    return null;
  }

  return (
    <Sources>
      <SourcesTrigger count={sources.length} />
      <SourcesContent>
        {sources.map((source, index) => (
          <Source href={source.url} key={index} title={source.title} />
        ))}
      </SourcesContent>
    </Sources>
  );
};

export default SourcesView;
