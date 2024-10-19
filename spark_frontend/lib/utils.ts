import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const truncatePubkey = (key: string, chars: number = 3) => {
  return `${key.slice(0, chars)}...${key.slice(-chars)}`;
};

export async function copy(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.clipboard !== "undefined" &&
      navigator.permissions !== undefined
    ) {
      const type = "text/plain";
      const blob = new Blob([text], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      navigator.permissions
        .query({ name: "clipboard-write" as PermissionName })
        .then((permission) => {
                if (permission.state === "granted" || permission.state === "prompt") {
                    navigator.clipboard.write(data).then(resolve, reject).catch(reject);
                }
                else {
                    reject(new Error("Permission not granted!"));
                }
            });
        }
        else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";
            textarea.style.width = '2em';
            textarea.style.height = '2em';
            textarea.style.padding = '0';
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand("copy");
                document.body.removeChild(textarea);
                resolve();
            }
            catch (e) {
                document.body.removeChild(textarea);
                reject(e);
            }
        }
        else {
            reject(new Error("None of copying methods are supported by this browser!"));
        }
    });
    
}


export async function share(data: ShareData): Promise<void> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    // Use the Web Share API if available
    try {
      await navigator.share(data);
      return;
    } catch (error) {
      console.error("Web Share API failed:", error);
      // Proceed to fallback methods
    }
  }

  // Fallback 1: Share via Clipboard (as a last resort)
  if (data.url || data.text) {
    const textToCopy = `${data.text || ""}\n${data.url || ""}`;
    try {
      await copy(textToCopy);
      alert("Copied to clipboard!");
      return;
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      throw new Error("Unable to share the content.");
    }
  }

  // If all methods fail
  throw new Error("No available method to share the content.");
}
