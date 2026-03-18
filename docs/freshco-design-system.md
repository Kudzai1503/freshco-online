# FreshCo Design System

This project's current homepage implementation is the source of truth for future UI work.

## Principles

- White-first layouts with green-led accents.
- Editorial hierarchy with strong headlines and calm supporting copy.
- Broad, screen-filling compositions over narrow centered containers.
- Flat surfaces by default with only subtle fades where separation is needed.
- Soft premium radii and restrained shadows.

## Core Tokens

- Primary text: `#173534`
- Secondary text: `#355654`
- Primary green: `#67BE63`
- Dark green: `#3F9853`
- Soft surface: `#F8FCF7`
- Soft surface alt: `#F9FCF8`
- Tinted surface: `#E7F5EB`
- Border: `rgba(23, 53, 52, 0.10)`

## Typography

- Font family: `Manrope`
- Headlines: high weight, tight tracking, strong line height
- Utility labels: uppercase with wider tracking
- Body copy: readable, medium-weight, secondary color

## Composition

- Use the full screen confidently.
- Avoid reverting to cream/off-white shells or generic SaaS spacing.
- Prefer large section bands with consistent horizontal padding.
- Keep spacing disciplined, not sparse.

## Surfaces and Effects

- Use solid white or soft green-tinted fills.
- Use only soft fade overlays when a flat surface needs depth.
- Avoid visible multi-stop gradients, glossy effects, or decorative color blends.

## Component Structure

- Follow the feature-sliced layout in `components/home/`.
- Reuse shared primitives before introducing new variants.
- Keep static content and style-driving config in dedicated data modules when practical.

## Validation

For future changes, check:

- `npm run lint`
- `npm run build`
- Visual consistency with this system
- Reuse of shared primitives and tokens where appropriate

