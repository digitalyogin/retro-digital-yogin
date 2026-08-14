export const UNICORN_STUDIO_RUNTIME_URL =
  "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.0-1/dist/unicornStudio.umd.js";

export type UnicornScene = {
  destroy: () => void;
  paused: boolean;
  resize: () => void;
};

type UnicornSceneOptions = {
  element: HTMLElement;
  projectId: string;
  dpi?: number;
  fps?: number;
  lazyLoad?: boolean;
  fixed?: boolean;
  production?: boolean;
  altText?: string;
  ariaLabel?: string;
  interactivity?: {
    mouse?: {
      disableMobile?: boolean;
      disabled?: boolean;
    };
  };
};

type UnicornStudioRuntime = {
  addScene: (options: UnicornSceneOptions) => Promise<UnicornScene>;
};

declare global {
  interface Window {
    UnicornStudio?: UnicornStudioRuntime;
  }
}

let runtimePromise: Promise<UnicornStudioRuntime> | null = null;

const getLoadedRuntime = () => {
  const runtime = window.UnicornStudio;
  return runtime?.addScene ? runtime : null;
};

export const loadUnicornStudio = (): Promise<UnicornStudioRuntime> => {
  const loadedRuntime = getLoadedRuntime();
  if (loadedRuntime) return Promise.resolve(loadedRuntime);
  if (runtimePromise) return runtimePromise;

  runtimePromise = new Promise<UnicornStudioRuntime>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>("script[data-dy-unicorn-runtime]");
    const script = existingScript ?? document.createElement("script");

    const handleLoad = () => {
      const runtime = getLoadedRuntime();
      if (runtime) {
        resolve(runtime);
        return;
      }
      runtimePromise = null;
      reject(new Error("Il runtime Unicorn Studio è stato caricato, ma l'API addScene non è disponibile."));
    };
    const handleError = () => {
      runtimePromise = null;
      reject(new Error(`Impossibile caricare il runtime Unicorn Studio: ${UNICORN_STUDIO_RUNTIME_URL}`));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.src = UNICORN_STUDIO_RUNTIME_URL;
      script.async = true;
      script.dataset.dyUnicornRuntime = "true";
      document.head.appendChild(script);
    }
  });

  return runtimePromise;
};
