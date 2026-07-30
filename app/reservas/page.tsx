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

export default function ReservationsPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState("Una perforación");
  const [notes, setNotes] = useState("");

  const ready = Boolean(name.trim() && date && time);
  const reservationUrl = useMemo(
    () =>
      whatsappHref(
        [
          "Hola DELAROSA ✨ Quiero solicitar una reserva para perforación de oreja.",
          "",
          `Nombre: ${name || "A completar"}`,
          `Servicio: ${service}`,
          `Fecha preferida: ${date || "A completar"}`,
          `Horario preferido: ${time || "A completar"}`,
          notes ? `Observaciones: ${notes}` : "",
          "",
          "¿Me confirman disponibilidad, indicaciones y precio final, por favor?",
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    [date, name, notes, service, time],
  );

  return (
    <>
      <section className="reservation-hero">
        <div className="reservation-intro">
          <span className="kicker kicker-light">
            Perforación de oreja · Con reserva
          </span>
          <h1>
            Elegí tu momento.
            <em>Nosotros cuidamos cada detalle.</em>
          </h1>
          <p>
            Completá tus preferencias y enviaremos la solicitud por WhatsApp.
            La reserva queda confirmada cuando el equipo de DELAROSA te responde.
          </p>
          <div className="reservation-benefits">
            <span>
              <ShieldCheck size={19} />
              Orientación y cuidado
            </span>
            <span>
              <Clock3 size={19} />
              Horario coordinado
            </span>
            <span>
              <Sparkles size={19} />
              Atención personalizada
            </span>
          </div>
          <div className="reservation-reference">
            <figure>
              <Image
                src="/products/piercing-reference-client.png"
                alt="Ejemplo de perforaciones y aros para inspiración"
                fill
                priority
                sizes="(max-width: 900px) 34vw, 190px"
              />
            </figure>
            <div>
              <span>Imagen de referencia</span>
              <strong>Inspiración para elegir tu estilo</strong>
              <p>
                El equipo te orientará sobre las opciones disponibles durante
                la confirmación de tu reserva.
              </p>
            </div>
          </div>
        </div>

        <form className="reservation-form" onSubmit={(event) => event.preventDefault()}>
          <div className="form-heading">
            <span>Solicitud de reserva</span>
            <h2>Perforación de oreja</h2>
          </div>
          <label>
            <span>Nombre y apellido *</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Tu nombre"
              autoComplete="name"
              required
            />
          </label>
          <label>
            <span>Servicio *</span>
            <select
              value={service}
              onChange={(event) => setService(event.target.value)}
            >
              <option>Una perforación</option>
              <option>Dos perforaciones</option>
              <option>Consulta previa</option>
            </select>
          </label>
          <div className="form-row">
            <label>
              <span>Fecha preferida *</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>
            <label>
              <span>Horario preferido *</span>
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
              />
            </label>
          </div>
          <label>
            <span>Observaciones</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Contanos si tenés alguna preferencia o consulta."
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
            Solicitar reserva por WhatsApp
            <ArrowUpRight size={17} />
          </a>
          <p>
            <Check size={14} /> No se realiza ningún cobro desde esta página.
          </p>
        </form>
      </section>

      <section className="reservation-steps">
        <div className="section-heading">
          <div>
            <span className="kicker">Cómo reservar</span>
            <h2>Simple, rápido y acompañado</h2>
          </div>
        </div>
        <div>
          <article>
            <span>01</span>
            <CalendarDays size={25} />
            <h3>Elegí fecha y horario</h3>
            <p>Indicá cuándo preferís visitar el local.</p>
          </article>
          <article>
            <span>02</span>
            <MessageCircle size={25} />
            <h3>Confirmamos por WhatsApp</h3>
            <p>El equipo revisa la agenda y confirma contigo.</p>
          </article>
          <article>
            <span>03</span>
            <Sparkles size={25} />
            <h3>Vení a DELAROSA</h3>
            <p>Recibí orientación e indicaciones para tu visita.</p>
          </article>
        </div>
      </section>
    </>
  );
}
