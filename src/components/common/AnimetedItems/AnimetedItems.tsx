import React, { useEffect, useRef, useState } from "react";



// НЕТУ АНИМАЦИИ УДАЛЕНИЯ У ВСЕХ ЭЛЕМЕНТОВ СПИСКА КРОМЕ ПОСЛЕДНЕГО



interface Props<T> {
  items: T[];
  duration?: number;
  enterClass?: string;
  enterActiveClass?: string;
  leaveClass?: string;
  leaveActiveClass?: string;
  getItemRef?: (item: T) => React.Ref<HTMLDivElement> | null;
  renderItem: (
    item: T,
    className: string,
    ref: React.Ref<HTMLDivElement>
  ) => React.ReactNode;
}

interface ItemState<T> {
  item: T;
  status: "entering" | "entered" | "leaving";
}

function AnimatedItems<T extends { id: string | number }>({
  items,
  duration = 300,
  enterClass = "",
  enterActiveClass = "",
  leaveClass = "",
  leaveActiveClass = "",
  getItemRef,
  renderItem,
}: Props<T>) {
  const [renderedItems, setRenderedItems] = useState<ItemState<T>[]>([]);
  const refs = useRef<Record<string | number, HTMLDivElement | null>>({});
  const timeouts = useRef<Record<string | number, number>>({});

  // sync items with state
  useEffect(() => {
    setRenderedItems(prev => {
      const newIds = new Set(items.map(i => i.id));
      const prevIds = new Set(prev.map(p => p.item.id));
      const next: ItemState<T>[] = [];

      for (const p of prev) {
        if (newIds.has(p.item.id)) {
          next.push({ item: p.item, status: "entered" });
        } else if (p.status !== "leaving") {
          next.push({ item: p.item, status: "leaving" });
        } else {
          next.push(p);
        }
      }

      for (const item of items) {
        if (!prevIds.has(item.id)) {
          next.push({ item, status: "entering" });
        }
      }

      const order = new Map(items.map((item, i) => [item.id, i]));
      next.sort((a, b) => {
        const ai = order.get(a.item.id) ?? Infinity;
        const bi = order.get(b.item.id) ?? Infinity;
        return ai - bi;
      });

      return next;
    });
  }, [items]);

  useEffect(() => {
    renderedItems.forEach(({ item, status }) => {
      const node = refs.current[item.id];
      if (!node) return;

      const clear = () => {
        if (timeouts.current[item.id]) {
          clearTimeout(timeouts.current[item.id]);
          delete timeouts.current[item.id];
        }
      };

      if (status === "entering") {
        node.classList.add(enterClass);
        void node.offsetHeight;
        node.classList.add(enterActiveClass);

        clear();
        timeouts.current[item.id] = window.setTimeout(() => {
          setRenderedItems(prev =>
            prev.map(p =>
              p.item.id === item.id ? { ...p, status: "entered" } : p
            )
          );
          node.classList.remove(enterClass, enterActiveClass);
        }, duration);
      }

      if (status === "leaving") {
        const nodeNow = node; // <-- важно: сохранить текущий DOM-ноду

        nodeNow.classList.remove(enterClass, enterActiveClass);
        nodeNow.classList.add(leaveClass);

        requestAnimationFrame(() => {
          nodeNow.classList.add(leaveActiveClass);

          clear();
          timeouts.current[item.id] = window.setTimeout(() => {
            setRenderedItems(prev =>
              prev.filter(p => p.item.id !== item.id)
            );
          }, duration);
        });
      }
    });

    return () => {
      Object.values(timeouts.current).forEach(clearTimeout);
      timeouts.current = {};
    };
  }, [renderedItems, duration]);

  return (
    <>
      {renderedItems.map(({ item, status }) => {
        const internalRefCallback = (node: HTMLDivElement | null) => {
          refs.current[item.id] = node;

          const externalRef = getItemRef?.(item);
          if (typeof externalRef === "function") {
            externalRef(node);
          } else if (externalRef && typeof externalRef === "object") {
            (externalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        };

        let className = "";
        if (status === "entering") className = enterClass;
        if (status === "entered") className = `${enterClass} ${enterActiveClass}`;
        if (status === "leaving") className = `${leaveClass} ${leaveActiveClass}`;

        return (
          <React.Fragment key={item.id}>
            {renderItem(item, className, internalRefCallback)}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default AnimatedItems;