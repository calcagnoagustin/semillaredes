# Agentes de Claude Code — Semilla Redes

Esta carpeta guarda **subagentes** de Claude Code: especialistas reutilizables
que podés invocar para tareas concretas. Cada agente es un archivo `.md` con
instrucciones propias.

## ¿Cómo funciona?

Cada archivo `.md` de esta carpeta define un agente. Tiene dos partes:

1. **Frontmatter** (entre `---`): metadatos del agente.
2. **Cuerpo**: las instrucciones / personalidad del agente (su "system prompt").

```markdown
---
name: nombre-del-agente
description: Cuándo usar este agente. Sé específico — Claude lo lee para decidir cuándo invocarlo automáticamente.
tools: Read, Grep, Glob   # opcional. Si lo omitís, hereda todas las tools.
model: sonnet             # opcional: sonnet | opus | haiku. Si lo omitís, hereda el del chat.
---

Acá van las instrucciones del agente. Explicale quién es, qué hace,
qué tono usar, qué reglas seguir y qué entregar como resultado.
```

## ¿Cómo lo uso?

- **Automático**: si el `description` es claro, Claude Code elige el agente solo
  cuando la tarea encaja.
- **Manual**: pedíselo explícitamente, por ejemplo:
  > "Usá el agente `revisor-copy` para revisar el texto de `landing.html`"

## Agentes disponibles

| Agente | Para qué sirve |
|--------|----------------|
| `revisor-copy` | Revisa y mejora textos de marketing (landings, emails, posts) con foco en conversión. |
| `generador-contenido` | Genera ideas y borradores de contenido para redes (Instagram, etc.) para artistas y CMs. |

## Agregar un agente nuevo

1. Creá un archivo `nuevo-agente.md` en esta carpeta.
2. Completá el frontmatter (`name`, `description`) y las instrucciones.
3. Listo — Claude Code lo detecta automáticamente.

> Tip: empezá copiando uno de los ejemplos y ajustándolo.
