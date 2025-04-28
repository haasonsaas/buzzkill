# BuzzKill - LinkedIn Vendor Hype Detector

A Chrome extension that helps you identify and filter out buzzword-heavy company posts on LinkedIn.

## Features

- Automatically detects and flags company posts with excessive buzzwords
- Color-coded scoring system (green → yellow → red) based on hype intensity
- Works seamlessly with your LinkedIn feed
- Comprehensive buzzword database covering tech, business, and crypto terminology

### Demo

Watch the demo video here: https://www.loom.com/share/de4c4e24d3534db9b666828a4c4b9e53

## Installation

1. Clone this repository:
```bash
git clone https://github.com/haasonsaas/buzzkill.git
cd buzzkill
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory from this project

## How It Works

The extension monitors your LinkedIn feed and:
1. Identifies company posts (vs. personal updates)
2. Analyzes the content for buzzwords and hype terminology
3. Assigns a score based on the frequency of buzzwords
4. Displays a color-coded badge on each post:
   - Green: Minimal hype
   - Yellow: Moderate hype
   - Red: Excessive hype

## Development

To start development:

```bash
npm run dev
```

This will start the development server with hot reloading enabled.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the need to filter out marketing noise on professional networks
- Built with modern web technologies for optimal performance
