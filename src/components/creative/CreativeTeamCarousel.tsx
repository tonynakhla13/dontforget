"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TEAM_CARDS, type TeamCardData } from "@/components/about/teamCards";

function logicalIndex(position: number, count: number) {
  return ((position % count) + count) % count;
}

function CreativeTeamCard({ card, active }: { card: TeamCardData; active: boolean }) {
  const isFounder = card.type === "founder";
  const title = isFounder ? card.name : card.role;
  const role = isFounder ? card.role : "Open position";
  const body = isFounder ? card.bio : card.note;

  return (
    <article className="c-team-card" data-active={active} data-open={!isFounder}>
      <div className="c-team-card__body">
        <div className="c-team-card__head">
          <span className="c-team-card__num">{card.num} / {String(TEAM_CARDS.length).padStart(2, "0")}</span>
          <span className="c-team-card__status">{isFounder ? "Founder" : "We're hiring"}</span>
        </div>
        <p className="c-team-card__role">{role}</p>
        <h3>{title}</h3>

        <div className="c-team-card__detail">
          <div>
            <p className="c-team-card__copy">{body}</p>

            {isFounder && (
              <div className="c-team-card__stats">
                {card.stats.map((stat) => (
                  <div key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="c-team-card__tags">
              {card.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            {isFounder ? (
              <p className="c-team-card__location">{card.location}</p>
            ) : (
              <a className="c-team-card__apply" href="mailto:hello@dontforget.studio">Apply for this seat →</a>
            )}
          </div>
        </div>
      </div>

      <div className="c-team-card__media">
        {isFounder ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.image} alt={`${card.name} - ${card.role}`} draggable={false} />
        ) : (
          <div className="c-team-card__open">?</div>
        )}
      </div>
    </article>
  );
}

export default function CreativeTeamCarousel() {
  const count = TEAM_CARDS.length;
  const [position, setPosition] = useState(count);
  const [transitioning, setTransitioning] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [cardWidth, setCardWidth] = useState(360);
  const [viewportWidth, setViewportWidth] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(count);
  const pausedRef = useRef(false);
  const hoveredRef = useRef(false);
  const dragRef = useRef({ active: false, startX: 0, moved: false });
  const active = logicalIndex(position, count);

  const previewWrapRef = useRef<HTMLDivElement>(null);
  const previewInnerRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);
  const cur = useRef({ x: -1200, y: -1200 });
  const tgt = useRef({ x: -1200, y: -1200 });
  const rafId = useRef(0);

  useEffect(() => {
    const LERP = 0.11;
    function tick() {
      const dx = tgt.current.x - cur.current.x;
      const dy = tgt.current.y - cur.current.y;
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        cur.current.x += dx * LERP;
        cur.current.y += dy * LERP;
        if (previewWrapRef.current) {
          previewWrapRef.current.style.transform =
            `translate(${cur.current.x}px, ${cur.current.y}px) rotate(2deg)`;
        }
      }
      rafId.current = requestAnimationFrame(tick);
    }
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  function handlePreviewMove(e: React.MouseEvent<HTMLDivElement>) {
    const h = previewWrapRef.current?.offsetHeight ?? 220;
    tgt.current = { x: e.clientX + 28, y: e.clientY - h / 2 };
  }

  function handlePreviewEnter(image?: string) {
    const inner = previewInnerRef.current;
    const img = previewImgRef.current;
    if (!inner || !image) return;
    if (img) img.src = image;
    inner.style.opacity = "1";
    inner.style.transform = "scale(1)";
  }

  function handlePreviewLeave() {
    const inner = previewInnerRef.current;
    if (!inner) return;
    inner.style.opacity = "0";
    inner.style.transform = "scale(0.9)";
  }

  const goToPosition = useCallback((next: number) => {
    setTransitioning(true);
    positionRef.current = next;
    setPosition(next);

    if (next < count || next >= count * 2) {
      window.setTimeout(() => {
        const normalized = count + logicalIndex(next, count);
        setTransitioning(false);
        positionRef.current = normalized;
        setPosition(normalized);
        window.requestAnimationFrame(() => setTransitioning(true));
      }, 600);
    }
  }, [count]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!pausedRef.current && !dragRef.current.active) goToPosition(positionRef.current + 1);
    }, 3600);
    return () => window.clearInterval(id);
  }, [goToPosition]);

  useEffect(() => {
    const measure = () => {
      setCardWidth(cardRef.current?.offsetWidth ?? 360);
      setViewportWidth(viewportRef.current?.offsetWidth ?? 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function goToCard(nextActive: number) {
    let delta = nextActive - logicalIndex(positionRef.current, count);
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    goToPosition(positionRef.current + delta);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pausedRef.current = true;
    setDragging(true);
    dragRef.current = { active: true, startX: e.clientX, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 6) dragRef.current.moved = true;
    trackRef.current?.style.setProperty("--drag-x", `${dx}px`);
  }

  function onPointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    dragRef.current.active = false;
    setDragging(false);
    trackRef.current?.style.setProperty("--drag-x", "0px");
    if (Math.abs(dx) > 55) goToPosition(positionRef.current + (dx < 0 ? 1 : -1));
    pausedRef.current = hoveredRef.current;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }

  const gap = 28;
  const offset = position * (cardWidth + gap) - (viewportWidth - cardWidth) / 2;
  const loopedCards = [0, 1, 2].flatMap((rep) => TEAM_CARDS.map((card, index) => ({ card, rep, index })));

  return (
    <div
      className="c-team-carousel"
      onMouseEnter={() => { hoveredRef.current = true; pausedRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; pausedRef.current = false; handlePreviewLeave(); }}
      onMouseMove={handlePreviewMove}
    >
      <div
        ref={previewWrapRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          transform: "translate(-1200px, -1200px) rotate(2deg)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      >
        <div
          ref={previewInnerRef}
          style={{
            width: "clamp(200px, 18vw, 290px)",
            aspectRatio: "4 / 5",
            overflow: "hidden",
            borderRadius: "14px",
            border: "2px solid #231f20",
            boxShadow: "6px 8px 0 #46D12A, 10px 14px 0 #231f20",
            background: "#e9e9e9",
            opacity: 0,
            transform: "scale(0.9)",
            transition: "opacity 0.2s ease, transform 0.22s cubic-bezier(.34,1.56,.64,1)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={previewImgRef}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <span style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 24,
            height: 24,
            background: "#46D12A",
            borderRadius: "14px 0 14px 0",
            pointerEvents: "none",
          }} />
        </div>
      </div>
      <div
        ref={viewportRef}
        className="c-team-carousel__viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <div
          ref={trackRef}
          className="c-team-carousel__track"
          style={{
            transform: `translate3d(calc(${-offset}px + var(--drag-x, 0px)),0,0)`,
            transition: transitioning && !dragging ? "transform 600ms cubic-bezier(0.22,1,0.36,1)" : "none",
          }}
        >
          {loopedCards.map(({ card, rep, index }) => {
            const cardPosition = rep * count + index;
            const d = cardPosition - position;
            const ad = Math.abs(d);
            const dir = Math.sign(d);
            const rotateY = dir * Math.min(ad, 2) * 16;
            const z = -Math.min(ad, 3) * 88;
            const scale = ad === 0 ? 1 : Math.max(0.82, 1 - ad * 0.11);
            const opacity = ad === 0 ? 1 : Math.max(0.28, 1 - ad * 0.4);
            return (
              <div
                key={`${rep}-${card.num}`}
                ref={cardPosition === 0 ? cardRef : undefined}
                className="c-team-carousel__cell"
                style={{
                  transform: `perspective(1400px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  transition: transitioning && !dragging
                    ? "transform 600ms cubic-bezier(0.22,1,0.36,1), opacity 600ms ease"
                    : "none",
                }}
                onClick={() => { if (!dragRef.current.moved) goToPosition(cardPosition); }}
                onMouseEnter={() => handlePreviewEnter(card.type === "founder" ? card.image : undefined)}
                onMouseLeave={handlePreviewLeave}
              >
                <CreativeTeamCard card={card} active={cardPosition === position} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="c-team-carousel__controls">
        <div className="c-team-carousel__dots">
          {TEAM_CARDS.map((card, index) => (
            <button
              key={card.num}
              type="button"
              aria-label={`Go to team card ${index + 1}`}
              data-active={index === active}
              onClick={() => goToCard(index)}
            />
          ))}
        </div>
        <div className="c-team-carousel__arrows">
          <button type="button" aria-label="Previous" onClick={() => goToPosition(positionRef.current - 1)}>←</button>
          <button type="button" aria-label="Next" onClick={() => goToPosition(positionRef.current + 1)}>→</button>
        </div>
      </div>
    </div>
  );
}
