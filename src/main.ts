import {
  Plugin,
  MarkdownRenderer,
  MarkdownView,
  Menu,
  Notice,
  TFile,
} from "obsidian";

export default class FlexibleColumnsPlugin extends Plugin {
  onload() {
    this.addStyles();

    this.registerMarkdownCodeBlockProcessor(
      "columns",
      async (source, el, ctx) => {
        const parts = source
          .split(/^___$/m)
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

        const container = document.createElement("div");
        container.className = "columns-container";

        const columns: HTMLElement[] = [];
        for (const part of parts) {
          const col = document.createElement("div");
          col.className = "column";

          // --- Resolve embedded content (e.g. ![[image.jpg]])
          const resolved = this.resolveEmbeds(part, ctx.sourcePath);

          await MarkdownRenderer.renderMarkdown(
            resolved,
            col,
            ctx.sourcePath,
            ctx
          );
          columns.push(col);
          container.appendChild(col);
        }

        for (let i = 0; i < columns.length - 1; i++) {
          const splitter = document.createElement("div");
          splitter.className = "splitter";
          container.insertBefore(splitter, columns[i + 1]);

          this.makeSplitterDraggable(splitter, columns[i], columns[i + 1]);
        }

        el.empty();
        el.appendChild(container);
      }
    );

    this.registerContextMenu();
  }

  registerContextMenu() {
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor) => {
        menu.addItem((mainItem) => {
          mainItem.setTitle("Insert Columns");
          mainItem.setIcon("layout");

          const columnsSubmenu = mainItem.setSubmenu();

          for (let i = 2; i <= 4; i++) {
            columnsSubmenu.addItem((colItem) => {
              colItem.setTitle(`${i} Column${i > 1 ? "s" : ""}`);
              if (i === 2) colItem.setIcon("panel-left");
              if (i === 3) colItem.setIcon("layout-grid");
              if (i === 4) colItem.setIcon("grid");
              colItem.onClick(() => {
                const view =
                  this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!view) {
                  new Notice("No active markdown view!");
                  return;
                }

                const editor = view.editor;
                let template = "```columns\n";
                for (let j = 0; j < i; j++) {
                  template += `${j + 1}. column\n`;
                  if (j < i - 1) template += "___\n";
                }
                template += "```\n";

                editor.replaceSelection(template);
                new Notice(`${i} column template inserted.`);
              });
            });
          }
        });
      })
    );
  }

  // Convert embedded ![[...]] to <img> tags
  resolveEmbeds(markdown: string, sourcePath: string): string {
    return markdown.replace(/!\[\[(.+?)\]\]/g, (match, fileName) => {
      const file = this.app.metadataCache.getFirstLinkpathDest(fileName, sourcePath);
      if (!file)
        return `<span style="color:red;">[Not found: ${fileName}]</span>`;
      const path = this.app.vault.getResourcePath(file as TFile);

      // 🔽 New part: If it's .html, render as iframe
      if (fileName.endsWith(".html")) {
        return `<iframe src="${path}" width="100%" height="200px" style="border: none;"></iframe>`;
      }

      // For everything else, render as <img> tag
      return `<img src="${path}" alt="${fileName}" style="max-width: 100%; height: auto;">`;
    });
  }

  addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .columns-container {
        display: flex;
        width: 100%;
        user-select: none;
      }
      .columns-container > .column {
        flex-grow: 1;
        flex-basis: 0;
        padding: 20px 0 0 0;
        min-height: 50px;
        background: transparent !important;
        border: none !important;
        color: inherit !important;
      }
      .columns-container > .splitter {
        width: 2px;
        padding: 0;
        background-color:rgb(62, 62, 62);
        cursor: col-resize;
        margin: 20px 5px 0 5px;
      }
      .columns-container > .splitter:hover {
        background-color: var(--interactive-accent-hover);
      }
    `;
    document.head.appendChild(style);
  }

  makeSplitterDraggable(
    splitter: HTMLElement,
    leftCol: HTMLElement,
    rightCol: HTMLElement
  ) {
    let isDragging = false;
    let startX = 0;
    let startLeftWidth = 0;
    let startRightWidth = 0;

    splitter.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startLeftWidth = leftCol.getBoundingClientRect().width;
      startRightWidth = rightCol.getBoundingClientRect().width;
      document.body.style.cursor = "col-resize";
      e.preventDefault();
    });

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const containerWidth =
        leftCol.parentElement!.getBoundingClientRect().width;

      let newLeftWidth = startLeftWidth + dx;
      let newRightWidth = startRightWidth - dx;

      if (newLeftWidth < 50) {
        newLeftWidth = 50;
        newRightWidth = containerWidth - newLeftWidth - splitter.offsetWidth;
      } else if (newRightWidth < 50) {
        newRightWidth = 50;
        newLeftWidth = containerWidth - newRightWidth - splitter.offsetWidth;
      }

      const leftPercent = (newLeftWidth / containerWidth) * 100;
      const rightPercent = (newRightWidth / containerWidth) * 100;

      leftCol.style.flex = `0 0 ${leftPercent}%`;
      rightCol.style.flex = `0 0 ${rightPercent}%`;
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }
}
