"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { whatsappHref } from "@/lib/store";
import type { ReservationContent } from "@/sanity/lib/site-content";

const benefitIcons = {
  shield: ShieldCheck,
  clock: Clock3,
  sparkles: Sparkles,
} satisfies Record<ReservationContent["benefits"][number]["icon"], typeof Sparkles>;

const stepIcons = {
  calendar: CalendarDays,
  message: MessageCircle,
  sparkles: Sparkles,
} satisfies Record<ReservationContent["steps"][number]["icon"], typeof Sparkles>;

export function ReservationPageContent({
  content,
  whatsappNumber,
}: {
  content: ReservationContent;
  whatsappNumber: string;
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState(content.serviceOptions[0] ?? "");
  const [notes, setNotes] = useState("");

  const ready = Boolean(name.trim() && date && time && service);
  const reservationUrl = useMemo(
    () =>
      whatsappHref(
        [
          content.whatsappIntro,
          "",
          `Nombre: ${name || "A completar"}`,
          `Servicio: ${service || "A completar"}`,
          `Fecha preferida: ${date || "A completar"}`,
          `Horario preferido: ${time || "A completar"}`,
          notes ? `Observaciones: ${notes}` : "",
          "",
          content.whatsappOutro,
        ]
          .filter(Boolean)
          .join("\n"),
        whatsappNumber,
      ),
    [content, date, name, notes, service, time, whatsappNumber],
  );

  return (
    <>
      <section className="reservation-hero">
        <div className="reservation-intro">
          <span className="kicker kicker-light">{content.kicker}</span>
          <h1>
            {content.title}
            <em>{content.emphasis}</em>
          </h1>
          <p>{content.description}</p>
          <div className="reservation-benefits">
            {content.benefits.map((benefit) => {
              const Icon = benefitIcons[benefit.icon] ?? Sparkles;

              return (
                <span key={benefit._key}>
                  <Icon size={19} />
                  {benefit.title}
                </span>
              );
            })}
          </div>
          <div className="reservation-reference">
            <figure>
              <Image
                src={content.referenceImage.src}
                alt={content.referenceImage.alt}
                fill
                priority
                sizes="(max-width: 900px) 34vw, 190px"
              />
            </figure>
            <div>
              <span>{content.referenceEyebrow}</span>
              <strong>{content.referenceTitle}</strong>
              <p>{content.referenceDescription}</p>
            </div>
          </div>
        </div>

        <form className="reservation-form" onSubmit={(event) => event.preventDefault()}>
          <div className="form-heading">
            <span>{content.formEyebrow}</span>
            <h2>{content.formTitle}</h2>
          </div>
          <label>
            <span>{content.nameLabel}</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={content.namePlaceholder}
              autoComplete="name"
              required
            />
          </label>
          <label>
            <span>{content.serviceLabel}</span>
            <select
              value={service}
              onChange={(event) => setService(event.target.value)}
            >
              {content.serviceOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <label>
              <span>{content.dateLabel}</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>
            <label>
              <span>{content.timeLabel}</span>
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
              />
            </label>
          </div>
          <label>
            <span>{content.notesLabel}</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={content.notesPlaceholder}
              rows={3}
            />
          </label>
          <a
            className={`reservation-submit ${ready ? "" : "is-disabled"}`}
            href={ready ? reservationUrl : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={!ready}
          >
            <MessageCircle size={18} />
            {content.buttonLabel}
            <ArrowUpRight size={17} />
          </a>
          <p>
            <Check size={14} /> {content.paymentNotice}
          </p>
        </form>
      </section>

      <section className="reservation-steps">
        <div className="section-heading">
          <div>
            <span className="kicker">{content.stepsKicker}</span>
            <h2>{content.stepsTitle}</h2>
          </div>
        </div>
        <div>
          {content.steps.map((step, index) => {
            const Icon = stepIcons[step.icon] ?? Sparkles;

            return (
              <article key={step._key}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon size={25} />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
