import { useQuery } from '@tanstack/react-query';
import { getNews } from '../../api/espn';
import { ExternalLink, Newspaper } from 'lucide-react';

interface Props {
  sport: string;
  league: string;
  teamId: string;
}

export function TeamNewsFeed({ sport, league, teamId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['news', league, teamId],
    queryFn: () => getNews(sport, league, teamId),
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-4 animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-surface-overlay rounded" />
        ))}
      </div>
    );
  }

  const articles = data?.articles ?? [];
  if (articles.length === 0) return null;

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border-subtle/30 flex items-center gap-2">
        <Newspaper size={16} className="text-text-muted" />
        <h3 className="font-display font-bold text-sm">News</h3>
      </div>
      <div className="divide-y divide-border-subtle/20">
        {articles.slice(0, 8).map((article, i) => (
          <a
            key={i}
            href={article.links?.web?.href ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 px-4 py-3 hover:bg-surface-overlay/30 transition-colors group"
          >
            {article.images?.[0]?.url && (
              <img
                src={article.images[0].url}
                alt=""
                className="w-16 h-12 object-cover rounded-lg shrink-0"
                loading="lazy"
              />
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                {article.headline}
              </h4>
              <p className="text-xs text-text-muted mt-1 line-clamp-1">
                {article.description}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                <ExternalLink size={10} />
                {new Date(article.published).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
