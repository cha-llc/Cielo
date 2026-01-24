 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index cc730c77fac34039b337476709a8fda4652b3a49..434d82597c408bc0ddb306cc10a689008c86f29c 100644
--- a/README.md
+++ b/README.md
@@ -1,5 +1,122 @@
-# Firebase Studio
+# Cielo
 
-This is a NextJS starter in Firebase Studio.
+A Next.js + Firebase + Genkit application for a wellness experience with AI-generated affirmations, journaling, meditations, and soundscapes. The codebase includes authentication, Firestore-backed user data, and multiple Genkit flows for personalized content generation.
 
-To get started, take a look at src/app/page.tsx.
+## Features
+
+- **User auth and profiles** backed by Firebase Auth + Firestore.
+- **Daily affirmations, mood analysis, and dream interpretation** via Genkit flows.
+- **Guided meditations + soundscapes with audio output** using Genkit.
+- **Firestore rules** enforcing user-ownership and data isolation.
+
+## Tech stack
+
+- **Next.js 15 / React 19** (app router).
+- **Firebase Auth + Firestore**.
+- **Genkit** with OpenAI.
+- **Tailwind CSS + shadcn/ui** components.
+
+## Getting started
+
+```bash
+npm install
+```
+
+Run the web app:
+
+```bash
+npm run dev
+```
+
+Run the Genkit dev server (loads `.env` via dotenv):
+
+```bash
+npm run genkit:dev
+```
+
+## API keys & configuration
+
+This app uses Firebase and OpenAI. You can supply keys in the locations below:
+
+### 1) Firebase configuration (client)
+
+The Firebase config is defined in `src/firebase/config.ts`. Update these values with your Firebase project configuration for local development.
+
+```ts
+export const firebaseConfig = {
+  apiKey: "AIzaSyCigrz7AkS8SVKJ9XHh2_QKLINMNWX2RA8",
+  authDomain: "studio-2539723907-d7516.firebaseapp.com",
+  projectId: "studio-2539723907-d7516",
+  storageBucket: "studio-2539723907-d7516.firebasestorage.app",
+  messagingSenderId: "811456090413",
+  appId: "1:811456090413:web:3e5f95c8f4f0c8b42b43a4",
+  measurementId: "G-KV3E67NZG7"
+};
+```
+
+In production (Firebase App Hosting), the app will first attempt to initialize Firebase using environment-provided options and fall back to this config.
+
+### 2) OpenAI (Genkit)
+
+OpenAI is configured in `src/ai/genkit.ts` via the `openAI` plugin. Replace the `apiKey` value with your key or refactor it to read from an environment variable.
+
+```ts
+openAI({
+  apiKey: "YOUR_OPENAI_API_KEY=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"
+})
+```
+
+#### Suggested `.env.local` (example)
+
+```bash
+OPENAI_API_KEY=your_openai_api_key_here
+```
+
+> The Genkit dev server loads `.env` via `dotenv` in `src/ai/dev.ts`.
+
+## Data model (Firestore)
+
+The Firestore schema is documented in `docs/backend.json`. Core collections:
+
+- `/users/{userId}` - user profiles.
+- `/users/{userId}/affirmations/{affirmationId}` - daily affirmations.
+- `/users/{userId}/moodEntries/{moodEntryId}` - mood + journal entries.
+- `/subscriptions/{subscriptionId}` - subscription data.
+- `/settings/{settingsId}` - user settings.
+
+Security rules live in `firestore.rules` and enforce user-level access control.
+
+## Scripts & workflows
+
+Common npm scripts:
+
+```bash
+npm run dev         # local Next.js dev server
+npm run genkit:dev  # Genkit dev server (flows)
+npm run build       # production build
+npm run start       # run production server
+npm run lint        # lint
+npm run typecheck   # TypeScript typecheck
+```
+
+## Deployments (Firebase App Hosting)
+
+- The app is configured for Firebase App Hosting via `apphosting.yaml` (runtime scaling settings).
+- Build the app with `npm run build` and deploy using your Firebase App Hosting workflow (Firebase CLI or console).
+- Ensure Firebase App Hosting environment variables are configured so `initializeApp()` can load Firebase options in production.
+
+## Project structure
+
+```
+src/
+  ai/               # Genkit configuration + AI flows
+  app/              # Next.js app router
+  components/       # UI components
+  firebase/         # Firebase initialization, providers, Firestore hooks
+docs/
+  backend.json      # Firestore data model documentation
+```
+
+## Troubleshooting
+
+- **Firestore permission errors**: Confirm rules match your data model and that user docs exist for authenticated users.
+- **Genkit audio generation failures**: Ensure your OpenAI API key is configured and that the model is available.
 
EOF
)
