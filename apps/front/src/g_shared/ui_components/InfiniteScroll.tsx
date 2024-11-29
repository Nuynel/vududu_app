import { useState, useEffect, useRef, ReactNode } from 'react';

interface InfiniteScrollProps {
  items: any[];
  loadMore?: () => void;
  children: (entity: any, index: number) => ReactNode; // Ожидаем функцию как children
}

const InfiniteScroll = ({ items, loadMore, children }: InfiniteScrollProps) => {
  const [visibleItems, setVisibleItems] = useState(items.slice(0, 20)); // Начальная загрузка
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreItems();
        }
      },
      {
        rootMargin: '100px', // Срабатывание за 100px до конца
      }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef]);

  useEffect(() => {
    setVisibleItems(items.slice(0, page * 20));
  }, [items])

  const loadMoreItems = () => {
    if (visibleItems.length >= items.length) return; // Если все данные загружены

    const newPage = page + 1;
    const moreItems = items.slice(0, newPage * 20); // Загружаем еще 20 элементов
    setVisibleItems(moreItems);
    setPage(newPage);
  };

  return (
    <div className="w-full space-y-2.5">
      {visibleItems.map((entity, index) => (
        <div key={index}>
          {children(entity, index)} {/* Рендеринг с использованием функции */}
        </div>
      ))}
      <div ref={observerRef} className="h-10 flex justify-center items-center">
        {visibleItems.length < items.length && <p>Загрузка...</p>}
      </div>
    </div>
  );
};

export default InfiniteScroll;

