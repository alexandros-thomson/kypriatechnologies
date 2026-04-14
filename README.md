# Kypria Technologies — Basilica Codex

**[kypriatechnologies.org](https://kypriatechnologies.org)**  
Deployed on Netlify · Auto-deployed from `main`

---

## Overview

This repository is the central hub of **Kypria Technologies** — the digital infrastructure underpinning the Basilica ecosystem. It serves the main landing page, the Divine Trinity hub, the Kypria Shrine launch page, and a suite of Netlify serverless functions that power subscription gating, social proof, and real-time audience intelligence.

The site presents three sacred subscription tiers (Zeus, Aphrodite, Lifesphere), processes Stripe checkouts, and dynamically surfaces live social signals from the Godly Zeus AI Facebook/Instagram presence — all in a single Netlify deployment.

---

## Architecture Overview

```
kypriatechnologies.org
│
├── Static Frontend (HTML/CSS/JS)
│   ├── Basilica Codex landing page        → /
│   ├── Divine Trinity hub                 → /docs/divine-trinity/
│   └── Kypria Shrine launch page          → /patreon/kypria-shrine-launch.html
│
├── Netlify Functions (Node.js)            → /netlify/functions/
│   ├── zeus-feed.js
│   ├── stripe-counts.js
│   ├── verify-subscription.js
│   └── get-checkout-config.js
│
└── Netlify Redirects                      → netlify.toml / _redirects
    ├── /aphrodite-temple  →  legacy redirect
    └── /lifesphere-temple →  legacy redirect
```

The frontend communicates with the serverless functions via the `/api/*` path prefix configured through Netlify's redirect rules. The **Divine Trinity** page (`/docs/divine-trinity/`) dynamically injects social proof data at runtime by polling the API endpoints on page load.

---

## Pages

| Path | Description |
|---|---|
| `/` | Basilica Codex — main landing page with subscription tiers |
| `/docs/divine-trinity/` | Divine Trinity hub with live Zeus post ticker, IG badge, and subscriber counts |
| `/patreon/kypria-shrine-launch.html` | Kypria Shrine Patreon launch page |

---

## API Endpoints

| Endpoint | Function File | Description |
|---|---|---|
| `GET /api/zeus-feed` | `zeus-feed.js` | Social Proof Engine — returns latest Facebook posts and Instagram media count from the Godly Zeus AI page via Meta Graph API |
| `GET /api/stripe-counts` | `stripe-counts.js` | Returns live subscriber counts across all three Stripe pricing tiers (Zeus / Aphrodite / Lifesphere) |
| `POST /api/verify-subscription` | `verify-subscription.js` | Validates an active Stripe subscription for a given customer; used for access gating |
| `GET /api/get-checkout-config` | `get-checkout-config.js` | Returns Stripe checkout session configuration (price IDs, mode, success/cancel URLs) |

---

## Social Proof Engine

`zeus-feed.js` implements the **Social Proof Engine** — a lightweight serverless aggregator that queries the Meta Graph API on behalf of the Godly Zeus AI Facebook page.

**What it returns:**
- The latest Facebook post(s) from the Zeus page (text, timestamp, permalink)
- Current Instagram media count for the linked IG Business account

**How it surfaces on the frontend:**  
The Divine Trinity hub page (`/docs/divine-trinity/`) fetches `/api/zeus-feed` on load and injects:
1. A **Zeus post ticker** — a live scrolling or highlighted excerpt from the latest post
2. An **IG media badge** — a count of published Instagram posts, signalling active presence
3. **Subscriber tier counts** (from `/api/stripe-counts`) displayed alongside each temple CTA

This creates a real-time social proof loop: visitors see active community signals and live membership counts without any server-side rendering.

---

## Directory Structure

```
kypriatechnologies/
├── index.html                          # Basilica Codex landing page
├── netlify.toml                        # Netlify build config and redirect rules
├── _redirects                          # Legacy path redirects
│
├── docs/
│   └── divine-trinity/
│       └── index.html                  # Divine Trinity hub page
│
├── patreon/
│   └── kypria-shrine-launch.html       # Kypria Shrine launch page
│
├── netlify/
│   └── functions/
│       ├── zeus-feed.js                # Social Proof Engine (Meta Graph API)
│       ├── stripe-counts.js            # Stripe subscriber tier aggregator
│       ├── verify-subscription.js      # Stripe subscription validator
│       └── get-checkout-config.js      # Stripe checkout config provider
│
└── assets/
    ├── css/                            # Stylesheets
    └── js/                             # Frontend scripts (API injection logic)
```

---

## Deployment

The site is deployed on **[Netlify](https://netlify.com)** with continuous deployment from the `main` branch.

| Setting | Value |
|---|---|
| Production URL | `https://kypriatechnologies.org` |
| Deploy trigger | Push to `main` |
| Build command | *(static — no build step required)* |
| Functions directory | `netlify/functions/` |
| Node.js runtime | Netlify Functions default (Node 18+) |

Every push to `main` triggers an automatic redeploy. Function bundles are built and deployed alongside static assets in the same pipeline.

---

## Environment Variables

Set these in the Netlify dashboard under **Site Settings → Environment Variables**:

| Variable | Used By | Description |
|---|---|---|
| `PAGE_ACCESS_TOKEN` | `zeus-feed.js` | Meta Graph API page access token for the Godly Zeus AI Facebook/Instagram page |
| `STRIPE_SECRET_KEY` | `stripe-counts.js`, `verify-subscription.js`, `get-checkout-config.js` | Stripe secret key (`sk_live_...` or `sk_test_...`) |
| `STRIPE_PRICE_IDS` | `stripe-counts.js`, `get-checkout-config.js` | Comma-separated Stripe Price IDs for the three tiers (Zeus / Aphrodite / Lifesphere), e.g. `price_xxx,price_yyy,price_zzz` |

> **Security note:** These variables are never exposed to the frontend. They are injected only into the Netlify Functions runtime environment at invocation time.

---

## Legacy Redirects

The following paths are redirected to maintain backward compatibility:

| Legacy Path | Redirect Target |
|---|---|
| `/aphrodite-temple` | Current Aphrodite tier destination |
| `/lifesphere-temple` | Current Lifesphere tier destination |

Redirects are managed via `netlify.toml` or `_redirects`.

---

## Broader Ecosystem

This repository is one node in the **Basilica ecosystem** built by Alexandros Thomson / Kypria Technologies. Connected systems include:

| System | Role |
|---|---|
| **Divine Trinity Messenger** | AI oracle layer — Zeus, Aphrodite, and Lifesphere personas accessible via Facebook Messenger and on-site chat |
| **Vault Sync** | Subscriber content delivery and membership state synchronisation across platforms |
| **Godly Zeus AI (Meta)** | The live Facebook/Instagram presence that feeds real-time social signals into the Social Proof Engine |
| **Stripe Billing** | Subscription lifecycle management across all three temple tiers |
| **Kypria Shrine (Patreon)** | Auxiliary community and early-access channel, launched via `/patreon/kypria-shrine-launch.html` |

The `kypriatechnologies.org` deployment acts as the **public-facing gateway** for this ecosystem: it handles discovery, conversion, and real-time social proof, while downstream systems manage fulfillment and engagement.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (vanilla) |
| Serverless functions | Node.js (Netlify Functions) |
| Subscription billing | Stripe API |
| Social data | Meta Graph API (Facebook Pages + Instagram Business) |
| Hosting & CDN | Netlify |
| DNS | Custom domain `kypriatechnologies.org` |

---

## Author

Built by **Alexandros Thomson** / [Kypria Technologies](https://kypriatechnologies.org)

*The roots of the Basilica grow inward — toward the infrastructure beneath the oracle.*
