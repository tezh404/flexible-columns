# Flexible Columns Obsidian Plugin

A simple Obsidian plugin to split the editor into resizable columns. This plugin allows users to create flexible, resizable column layouts in their markdown notes.

## Features

- Split your editor into multiple columns (2 to 4 columns).
- Resizable columns with draggable dividers.
- Easy to use and highly customizable.

## Installation

### Manual Installation

1. Download the [latest release](https://github.com/tezh404/flexible-columns/releases) from GitHub.
2. Copy the contents to your Obsidian plugins folder:  
   `YourVault/.obsidian/plugins/flexible-columns/`
3. Enable the plugin in Obsidian’s settings under **Community Plugins**.

### Development Installation

If you want to develop or modify this plugin yourself, follow these steps:

1. Clone this repository:
    ```bash
    git clone https://github.com/your-username/flexible-columns.git
    cd flexible-columns
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Build the plugin:
    ```bash
    npm run build
    ```

4. Link the plugin to your Obsidian vault:
    - Copy the contents of the `dist/` folder and the `manifest.json` to your Obsidian vault's plugins directory:  
      `YourVault/.obsidian/plugins/flexible-columns/`
    - Restart Obsidian or reload the plugins.

## Usage

To insert columns in your markdown note, use the following syntax:

````markdown
```columns
First column content
___
Second column content
___
Third column content

You can also insert columns using the context menu:

1. Right-click in your markdown editor.
2. Select **Insert Columns** and choose the number of columns (2, 3, or 4).

## Development

### Build the Plugin

To build the plugin and create a new `main.js` file, run:

```bash
npm run build
```

This will compile TypeScript to JavaScript and bundle it into the `dist/` folder.

### Testing Locally

To test the plugin locally:

1. Navigate to your Obsidian vault.
2. Open the `.obsidian/plugins/flexible-columns/` folder.
3. Copy the contents from `dist/` and the `manifest.json` into this folder.
4. Reload your plugins in Obsidian.

## License

This plugin is open-source and available under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Feel free to submit issues, pull requests, or suggestions. Enjoy using **Flexible Columns** in Obsidian!
