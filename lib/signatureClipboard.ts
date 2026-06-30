const STYLE_BLOCK_PATTERN = /^<style[^>]*>[\s\S]*?<\/style>/i;

export function stripSignatureStyleBlock(html: string): string {
  return html.replace(STYLE_BLOCK_PATTERN, "").trim();
}

export function wrapSignatureForOfficePaste(html: string): string {
  const content = stripSignatureStyleBlock(html);
  return `<!--StartFragment--><div style="background-color:#ffffff;color:#000000;margin:0;padding:0;">${content}</div><!--EndFragment-->`;
}

function htmlToPlainText(html: string): string {
  if (typeof document === "undefined") return "";
  const container = document.createElement("div");
  container.innerHTML = stripSignatureStyleBlock(html);
  return container.textContent?.replace(/\s+\n/g, "\n").trim() ?? "";
}

function copyViaHiddenElement(html: string): boolean {
  const container = document.createElement("div");
  container.contentEditable = "true";
  container.innerHTML = wrapSignatureForOfficePaste(html);
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.background = "#ffffff";
  document.body.appendChild(container);

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(container);
  selection?.removeAllRanges();
  selection?.addRange(range);

  const success = document.execCommand("copy");
  selection?.removeAllRanges();
  document.body.removeChild(container);
  return success;
}

export async function copyPlainText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
}

export async function copySignatureHtml(html: string): Promise<boolean> {
  return copyPlainText(html);
}

export async function copySignatureForOutlook(html: string): Promise<boolean> {
  const wrappedHtml = wrapSignatureForOfficePaste(html);
  const plainText = htmlToPlainText(html);

  if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([wrappedHtml], { type: "text/html" }),
          "text/plain": new Blob([plainText], { type: "text/plain" }),
        }),
      ]);
      return true;
    } catch {
      // Fall through to execCommand.
    }
  }

  return copyViaHiddenElement(html);
}
